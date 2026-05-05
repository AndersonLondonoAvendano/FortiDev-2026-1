/**
 * sonarService.js
 * Servicio de integración con backend/SonarQube.
 * Mapea los endpoints de Sonar a estructuras UI.
 */

const issueTypeMap = {
  VULNERABILITY: "Vulnerabilities",
  BUG: "Bugs",
  CODE_SMELL: "Code Smells",
  SECURITY_HOTSPOT: "Security Hotspots",
};

const normalizeSeverity = (severity) => {
  const value = severity?.toString().toUpperCase();
  if (value === "BLOCKER" || value === "CRITICAL" || value === "MAJOR" || value === "MINOR") {
    return value;
  }
  return value;
};

export async function fetchIssues() {
  const response = await fetch("/api/issues/search");
  const data = await response.json();
  return (data.issues || []).map(normalizeIssue);
}

export async function fetchProjectMetrics(projectKey) {
  const response = await fetch(`/api/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=coverage,duplicated_lines_density,ncloc,sqale_debt_ratio`);
  const data = await response.json();
  return normalizeMeasures(data);
}

export async function fetchQualityGate(projectKey) {
  const response = await fetch(`/api/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}`);
  const data = await response.json();
  return normalizeQualityGate(data);
}

function normalizeIssue(issue) {
  return {
    id: issue.key || issue.issueId || issue.id,
    issueType: issueTypeMap[issue.type] || issue.type,
    severity: normalizeSeverity(issue.severity),
    title: issue.message || issue.text || issue.rule || "Issue detected",
    project: issue.componentName || issue.project || "Unknown",
    file: issue.component || issue.file || issue.componentKey || "-",
    line: issue.line || issue.textRange?.startLine || "-",
    rule: issue.rule || issue.ruleKey || "-",
    status: issue.status || issue.resolution || "Open",
    date: issue.creationDate || issue.updateDate || "-",
    branch: issue.branch || issue.branchName || "main",
    commit: issue.hash || issue.commit || "-",
  };
}

function normalizeMeasures(data) {
  const measures = (data.component?.measures || []).reduce((acc, item) => {
    acc[item.metric] = item.value;
    return acc;
  }, {});

  return {
    coverage: parseFloat(measures.coverage || 0),
    duplication: parseFloat(measures.duplicated_lines_density || 0),
    loc: parseInt(measures.ncloc || 0, 10),
    debtRatio: parseFloat(measures.sqale_debt_ratio || 0),
  };
}

function normalizeQualityGate(data) {
  return {
    status: data.projectStatus?.status || "UNKNOWN",
    conditions: data.projectStatus?.conditions || [],
  };
}
