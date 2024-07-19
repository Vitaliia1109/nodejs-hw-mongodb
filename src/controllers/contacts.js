import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { parseSortParams } from '../utils/parseSortParams.js';

import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = { ...parseFilterParams(req.query), userId };

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const contact = await getContactById({ _id: contactId, userId });

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    data: contact,
    message: `Successfully found contact with id ${contactId}!`,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const payload = { ...req.body, userId };
    const contact = await createContact(payload);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const result = await updateContact({ _id: contactId, userId }, req.body);

  if (!result) {
    next(
      createHttpError(
        404,
        `Contact ${contactId} not found or you do not have permission to update it`,
      ),
    );
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated a contact!`,
    data: result.contact,
  });
};

export const deleteСontactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await deleteContact({ _id: contactId, userId });

  if (!contact) {
    next(
      createHttpError(
        404,
        `Contact ${contactId} not found or you do not have permission to delete it`,
      ),
    );
    return;
  }

  res.status(204).send();
};
