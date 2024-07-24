export function utcToLocal(utc_date: string) {
    const date = new Date(utc_date)
    var newDate = new Date(date.getTime()+date.getTimezoneOffset());
    return newDate.toISOString();
}

export function localToUTC(local_date: string) {
    const date = new Date(local_date)
    var newDate = new Date(date.getTime()-date.getTimezoneOffset());
    return newDate.toISOString();
}

function getUnixTimestamp( date: string){
    return Math.floor(new Date(date).getTime()/1000)
}

export function timezoneTest( knownUTC: string, knownLocal: string )
{
    let returnJson = {"RESULT":"", 
        "KNOWN_UTC":knownUTC, 
        "KNOWN_LOCAL": knownLocal, 
        "CALCULATED_UTC": localToUTC(knownLocal),
        "CALCULATED_LOCAL": utcToLocal(knownUTC)}


    let calculatedUTC = false;
    let calculatedLocal = false;
    if ( getUnixTimestamp(returnJson.CALCULATED_LOCAL) - getUnixTimestamp(knownLocal)  < 2)
        calculatedLocal = true
    if ( getUnixTimestamp(returnJson.CALCULATED_UTC) - getUnixTimestamp(knownUTC)  < 2)
        calculatedUTC = true

    if ( calculatedUTC && calculatedLocal)
        returnJson.RESULT = 'BOTH PASSED'
    else if ( calculatedUTC && !calculatedLocal )
        returnJson.RESULT = 'LOCAL -> UTC PASSED'
    else if ( !calculatedUTC && calculatedLocal )
        returnJson.RESULT = 'UTC -> LOCAL: PASSED'
    else 
        returnJson.RESULT = 'NEITHER PASSED'

    return returnJson
}