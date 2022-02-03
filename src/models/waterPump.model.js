
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class WaterPumpModel{
  tableName = "water_pump";
  find= async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;
     if (!Object.keys(params).length) {
            return await query(sql);
    }
     const { columnSet, values } = multipleColumnSet(params)
    sql += ` WHERE ${columnSet}`;
    return await query(sql, [...values]);
  }

   findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);
        return result[0];
  }
   create = async ({name_pump, region, district,balans_tash,code,lat,lon,topic,phone_number,volume_today}) => {
        const sql = `INSERT INTO ${this.tableName}
        (name_pump, region, district, balans_tash, code,lat, lon,topic,phone_number,volume_today) VALUES (?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [name_pump, region, district,balans_tash,code, lat,lon,topic,phone_number,volume_today]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
  }
  
   update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE water_pump SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
  }
}

module.exports = new WaterPumpModel;