import { Op } from 'sequelize';
import moment from 'moment';
import xlsxFile from 'read-excel-file/node';

import { REQ_CAR_MODEL, REQ_PEOPLE_MODEL } from '../models';

import { emitMessage, getUserId } from '../utils';
import { ROLE_ADMIN, ROLE_SECURITY, ROLE_USER, REQ_CAR, REQ_PEOPLE } from '../constants';
import { IRequest, IResponse } from '../interfaces/vendors';

export class ReqController {
  static async getAllRequests(role: string, req: IRequest, res: IResponse) {
    try {
      const Model = req?.body?.type === REQ_PEOPLE ? REQ_PEOPLE_MODEL : REQ_CAR_MODEL;
      let requests;

      await Model.sync();

      switch (role) {
        case ROLE_SECURITY:
          const date = moment().format('YYYY-MM-DD');
          requests = await Model.findAll({
            where: {
              [Op.or]: [
                {
                  date_start: {
                    [Op.lte]: date,
                  },
                  date_end: {
                    [Op.gte]: date,
                  },
                },
              ],
              [Op.and]: { is_approved: true },
            },
            order: ['fio', 'DESC'],
          });
          break;
        case ROLE_ADMIN:
          requests = await Model.findAll({ order: [['createdAt', 'DESC']] });
          break;
        default:
          throw new Error('Error');
      }

      res.status(200).json({
        status: 'success',
        data: requests?.reverse(),
      });
    } catch (error) {
      res.status(401).send({
        status: 'error',
        code: 401,
        type: error?.type || error?.errors?.type,
        message: error?.message || error?.errors?.message,
      });
    }
  }

  static async getAllRequestsByUserId(req: IRequest, res: IResponse) {
    try {
      const Model = req?.body?.type === REQ_PEOPLE ? REQ_PEOPLE_MODEL : REQ_CAR_MODEL;

      await Model.sync();

      const requests = await Model.findAll({
        where: {
          userId: req?.params?.id,
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        status: 'success',
        data: requests.reverse(),
      });
    } catch (error) {
      res.status(401).send({
        status: 'error',
        code: 401,
        type: error?.type || error?.errors?.type,
        message: error?.message || error?.errors?.message,
      });
    }
  }

  static async addRequest(role: string, req: IRequest, res: IResponse) {
    try {
      const {
        type,
        car_number,
        date_end,
        date_start,
        description,
        fio,
        is_approved,
        passengers,
        w_passengers,
        wo_wcreening,
      } = req?.body || {};

      const Model = type === REQ_PEOPLE ? REQ_PEOPLE_MODEL : REQ_CAR_MODEL;
      let reqData = {};
      let requests;
      const authToken = req?.headers?.authorization;
      const token = authToken?.slice(7, authToken?.length)?.trim();
      const userId = getUserId(token);

      await Model.sync();

      switch (type) {
        case REQ_PEOPLE:
          reqData = {
            date_end,
            date_start,
            description,
            fio,
            is_approved: role === ROLE_ADMIN ? is_approved : false,
            userId,
          };
          break;
        case REQ_CAR:
          reqData = {
            car_number,
            date_end,
            date_start,
            description,
            fio,
            is_approved: role === ROLE_ADMIN ? is_approved : false,
            passengers,
            w_passengers,
            wo_wcreening: role === ROLE_ADMIN ? wo_wcreening : false,
            userId,
          };
          break;
        default:
          throw new Error('Error');
      }

      await Model.create(reqData);
      await Model.sync();

      switch (role) {
        case ROLE_USER:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status || false,
            });

            await Model.sync();

            requests = await Model.findAll({
              where: {
                userId,
              },
              order: [['createdAt', 'DESC']],
            });
          });
          break;
        case ROLE_ADMIN:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status,
            });

            await Model.sync();

            requests = await Model.findAll({ order: [['createdAt', 'DESC']] });
          });
          break;
        default:
          throw new Error('Error');
      }

      res.status(200).json({
        status: 'success',
      });

      emitMessage([ROLE_ADMIN, ROLE_USER], userId, req?.body?.type, requests);
    } catch (error) {
      res.status(401).send({
        status: 'error',
        code: 401,
        type: error?.type || error?.errors?.type,
        message: error?.message || error?.errors?.message,
      });
    }
  }

  static async addRequestFromFile(role: string, req: IRequest, res: IResponse) {
    try {
      const { type } = req?.body || {};
      const Model = type === REQ_PEOPLE ? REQ_PEOPLE_MODEL : REQ_CAR_MODEL;
      let requests;
      const authToken = req?.headers?.authorization;
      const token = authToken?.slice(7, authToken?.length)?.trim();
      const userId = getUserId(token);

      Model.sync();

      const rows = await xlsxFile(`${process.cwd()}/uploads/${req?.file?.filename}`);
      delete rows[0];
      const rowsData = rows.filter((row, id) => (id !== 5 ? row !== null : row));
      let dataObjs;

      switch (type) {
        case REQ_CAR:
          dataObjs = rowsData?.map((row: any) => ({
            car_number: row[0],
            date_end: row[4],
            date_start: row[3],
            description: row[2],
            fio: row[1],
            is_approved: role === ROLE_ADMIN,
            passengers: row[5].split(','),
            w_passengers: row[5].length > 0,
            wo_wcreening: false,
            userId,
          }));
          break;
        case REQ_PEOPLE:
          dataObjs = rowsData?.map((row) => ({
            date_end: row[4],
            date_start: row[3],
            description: row[2],
            fio: row[1],
            is_approved: role === ROLE_ADMIN,
            userId,
          }));
          break;
        default:
          throw new Error('error');
      }

      dataObjs.forEach((dataObj) => Model.create(dataObj));
      Model.sync();

      switch (role) {
        case ROLE_USER:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status || false,
            });

            await Model.sync();

            requests = await Model.findAll({
              where: {
                userId,
              },
              order: [['createdAt', 'DESC']],
            });
          });
          break;
        case ROLE_ADMIN:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status,
            });

            await Model.sync();

            requests = await Model.findAll({ order: [['createdAt', 'DESC']] });
          });
          break;
        default:
          throw new Error('Error');
      }

      res.status(200).json({
        status: 'success',
      });

      emitMessage([ROLE_ADMIN, ROLE_USER], userId, req?.body?.type, requests);
    } catch (error) {
      res.status(401).send({
        status: 'error',
        code: 401,
        type: error?.type || error?.errors?.type,
        message: error?.message || error?.errors?.message,
      });
    }
  }

  static async changeStatus(role: string, req: IRequest, res: IResponse) {
    try {
      const Model = req?.body?.type === REQ_PEOPLE ? REQ_PEOPLE_MODEL : REQ_CAR_MODEL;
      let requests;
      let userId = null;

      await Model.sync();

      switch (role) {
        case ROLE_USER:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status || false,
            });

            let token = req?.headers?.authorization;

            if (token && token?.startsWith('Bearer ')) {
              token = token?.slice(7, token?.length);
            }

            if (token) {
              token = token?.trim();

              userId = getUserId(token);

              await Model.sync();

              requests = await Model.findAll({
                where: {
                  userId,
                },
                order: [['createdAt', 'DESC']],
              });
            } else {
              throw new Error('Error');
            }
          });
          break;
        case ROLE_ADMIN:
          req?.body?.ids?.forEach(async (itm: number) => {
            const request = await Model.findOne({ where: { id: itm } });

            request?.update({
              is_approved: req?.body?.new_status,
            });

            await Model.sync();

            requests = await Model.findAll({ order: [['createdAt', 'DESC']] });
          });
          break;
        default:
          throw new Error('Error');
      }

      res.status(200).json({
        status: 'success',
      });

      emitMessage([ROLE_ADMIN, ROLE_USER, ROLE_SECURITY], userId, req?.body?.type, requests);
    } catch (error) {
      res.status(401).send({
        status: 'error',
        code: 401,
        type: error?.type || error?.errors?.type,
        message: error.message || error?.errors?.message,
      });
    }
  }
}
