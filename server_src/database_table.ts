export const databaseTable = `
    CREATE TABLE IF NOT EXISTS power_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ACTIVE BOOLEAN,
    APC STRING,
    DATE STRING,
    HOSTNAME STRING,
    VERSION STRING,
    UPSNAME STRING,
    CABLE STRING,
    DRIVER STRING,
    UPSMODE STRING,
    STARTTIME STRING,
    MODEL STRING,
    STATUS STRING,
    LINEV FLOAT,
    LOADPCT FLOAT,
    BCHARGE FLOAT,
    TIMELEFT FLOAT,
    MBATTCHG INTEGER,
    MINTIMEL INTEGER,
    MAXTIME INTEGER,
    SENSE STRING,
    LOTRANS FLOAT,
    HITRANS FLOAT,
    ALARMDEL STRING,
    BATTV FLOAT,
    LASTXFER STRING,
    NUMXFERS INTEGER,
    TONBATT INTEGER,
    CUMONBATT INTEGER,
    XOFFBATT STRING,
    SELFTEST STRING,
    STATFLAG STRING,
    SERIALNO STRING,
    BATTDATE STRING,
    NOMINV FLOAT,
    NOMBATTV FLOAT,
    NOMPOWER INTEGER,
    FIRMWARE STRING,
    END_APC STRING
    )
`;

export const preparedJson = `{
    "ACTIVE": null,
    "APC": null,
    "DATE": null,
    "HOSTNAME": null,
    "VERSION": null,
    "UPSNAME": null,
    "CABLE": null,
    "DRIVER": null,
    "UPSMODE": null,
    "STARTTIME": null,
    "MODEL": null,
    "STATUS": null,
    "LINEV": null,
    "LOADPCT": null,
    "BCHARGE": null,
    "TIMELEFT": null,
    "MBATTCHG": null,
    "MINTIMEL": null,
    "MAXTIME": null,
    "SENSE": null,
    "LOTRANS": null,
    "HITRANS": null,
    "ALARMDEL": null,
    "BATTV": null,
    "LASTXFER": null,
    "NUMXFERS": null,
    "TONBATT": null,
    "CUMONBATT": null,
    "XOFFBATT": null,
    "SELFTEST": null,
    "STATFLAG": null,
    "SERIALNO": null,
    "BATTDATE": null,
    "NOMINV": null,
    "NOMBATTV": null,
    "NOMPOWER": null,
    "FIRMWARE": null,
    "END_APC": null
}`;

export const prepareDataInsert = `
    INSERT INTO power_data VALUES(
    NULL,
    :ACTIVE,
    :APC,
    :DATE,
    :HOSTNAME,
    :VERSION,
    :UPSNAME,
    :CABLE,
    :DRIVER,
    :UPSMODE,
    :STARTTIME,
    :MODEL,
    :STATUS,
    :LINEV,
    :LOADPCT,
    :BCHARGE,
    :TIMELEFT,
    :MBATTCHG,
    :MINTIMEL,
    :MAXTIME,
    :SENSE,
    :LOTRANS,
    :HITRANS,
    :ALARMDEL,
    :BATTV,
    :LASTXFER,
    :NUMXFERS,
    :TONBATT,
    :CUMONBATT,
    :XOFFBATT,
    :SELFTEST,
    :STATFLAG,
    :SERIALNO,
    :BATTDATE,
    :NOMINV,
    :NOMBATTV,
    :NOMPOWER,
    :FIRMWARE,
    :END_APC
    )
`;
