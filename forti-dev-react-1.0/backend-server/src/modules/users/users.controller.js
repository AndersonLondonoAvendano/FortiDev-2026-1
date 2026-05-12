import * as usersService from './users.service.js';

export async function listUsers(req, res, next) {
  try {
    res.json(await usersService.listUsers());
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    res.json(await usersService.getUser(req.params.id));
  } catch (err) { next(err); }
}

export async function createUser(req, res, next) {
  try {
    const user = await usersService.createUser(req.validated.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    res.json(await usersService.updateUser(req.params.id, req.validated.body));
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    res.json({ message: 'User deactivated' });
  } catch (err) { next(err); }
}

export async function changePassword(req, res, next) {
  try {
    await usersService.changePassword(req.params.id, req.validated.body, req.user.id);
    res.json({ message: 'Password updated' });
  } catch (err) { next(err); }
}
