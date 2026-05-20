import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as orgsApi from "../api/organizations.js";

const OrgContext = createContext(null);

export function OrgProvider({ children }) {
  const { isAuth } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      setOrgs([]);
      setCurrentOrg(null);
      return;
    }

    let cancelled = false;

    const fetchOrgs = async () => {
      setLoadingOrgs(true);
      try {
        const data = await orgsApi.listOrganizations();
        if (cancelled) return;

        setOrgs(data);

        // Restore last selected org or default to first
        const saved = localStorage.getItem("currentOrg");
        if (saved) {
          try {
            const savedOrg = JSON.parse(saved);
            const stillMember = data.find((o) => o.id === savedOrg.id);
            setCurrentOrg(stillMember ?? data[0] ?? null);
          } catch {
            setCurrentOrg(data[0] ?? null);
          }
        } else {
          setCurrentOrg(data[0] ?? null);
        }
      } catch {
        if (!cancelled) {
          setOrgs([]);
          setCurrentOrg(null);
        }
      } finally {
        if (!cancelled) setLoadingOrgs(false);
      }
    };

    fetchOrgs();
    return () => { cancelled = true; };
  }, [isAuth]);

  const switchOrg = useCallback((org) => {
    setCurrentOrg(org);
    if (org) {
      localStorage.setItem("currentOrg", JSON.stringify({ id: org.id, name: org.name }));
    } else {
      localStorage.removeItem("currentOrg");
    }
  }, []);

  return (
    <OrgContext.Provider value={{ orgs, currentOrg, loadingOrgs, switchOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  return useContext(OrgContext);
}
