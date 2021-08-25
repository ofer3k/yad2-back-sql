exports.converterTitleValues=async (obj)=>{
    let queryString = Object.keys(obj).map((key) => key).join(', ')
    return queryString
}

exports.converter= async(obj)=>{
    let queryString = Object.keys(obj).map((key) => {
        console.log(key,typeof obj[key],'type of' )
        if(typeof obj[key]=='string')return (`'${obj[key]}'`)
        if(typeof obj[key]=='boolean')return (String(obj[key]).toUpperCase())
        if (isNaN(obj[key]))return 0
        if (typeof obj[key]=='object' &&obj[key]==null) return (String(false).toUpperCase())
       return (obj[key])
    }).join(',')
    // console.log(queryString)
    return queryString
}
