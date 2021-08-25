const {Client}=require('pg');
var client = new Client(`postgres://postgres:ofer3k1998@localhost:5433/hand2`);
client.connect().then(()=>{})

// valid input - working fine with postgresql
const proc_string =`

'asdf',
	 1111111 ,
	 'property_type',
	 'property_condition', 
 	 'property_address_city',
	'property_address_street' ,
	 1 , 
 	 2 , 
     3 ,
	 4	,
	 false ,
	5 ,
	6 ,
	120 ,
	121,
	'contact_name' ,
	'contact_number_start' ,
	'contact_number' ,
	'mail@mainl.com' ,
	'route' ,
	'02/05/1998',
	false,
	true ,
	true ,
	true ,
	true,
	true,
	true,
	true,
	true ,
	true,
	true,
	true,
	true ,
	'pic1' ,
	'pic2' ,
	'pic3' ,
	'pic4' ,
	'pic5' ,
	'pic6' ,
	'02/05/1998' ,
	'02/05/1998' ,
	'userid'
    `

// not valid input- values came from client and needs to be adjust
exports.adjustingParameter=(params)=>{
    const words = params;
    words.splice(19, 0, `'basic'`);
    words.splice(words.length-1, 0, `''`);
    words.splice(words.length-1, 0, `'12/08/1998'`);
    words.splice(words.length-1, 0, `'12/08/1998'`);
    console.log(words.join(),'another_temp')
return (words.join())
}
// adjustingParameter(another_temp)

const proc_string2 =`
'תיאור הנכס ',1000000,
'Garden Apartment',
'New (property up to 5 years old)',
'ישוב',
'רחוב',
1,
2,
3,
4, 
FALSE, /small letters
0,
0,
120,
121,
'איש קשר',
'', /put space
'6305088', 
'',
'2021-08-22', /here route
FALSE, /here date
TRUE,
FALSE,
FALSE,
FALSE,
TRUE,
TRUE,
FALSE,
FALSE,
FALSE,
TRUE,
FALSE,
FALSE,
'', /another bool
'',
'',
'',
'',
// '',missing pic
// missing date
// missing date
'60cf14549999fc3c'
    `

    // 

    const proc_string2_1 =`'תיאור הנכס ',1000000,'Garden Apartment','New (property up to 5 years old)','ישוב','רחוב',1,2,3,4, FALSE, 0,0,120,121,'איש קשר','','6305088', '','2021-08-22',FALSE, TRUE,FALSE,FALSE,FALSE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE,'','','','','','','60cf14549999fc3c'`
    // 
// valid params from client after adjustments
    const proc_string3 =`
    'תיאור הנכס ',
    1000000,
    'Garden Apartment',
    'New (property up to 5 years old)',
    'ישוב',
    'רחוב',
    1,
    2,
    3,
    4, 
    false,
    0,
    0,
    120,
    121,
    'איש קשר',
    '',
    '6305088', 
    '',
    '', 
    '2021-08-22',
    FALSE, 
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    FALSE,
    '', 
    '',
    '',
    '',
    '',
    '',
    '2021-08-22',
    '2021-08-22',
    '60cf14549999fc3c'
        `  

        const final=`'asdfasdfasdfasdf',1222222,'Garden Apartment','New from a contractor','asdf','asdf',1,2,3,4,FALSE,0,2,122,125,'','','','basic','','2021-08-22',FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE,'https://res.cloudinary.com/dl5e2wsbh/image/upload/v1629624820/oferiko/gpipku6ynm5nvwdxqe3v.png','','','','','','12/08/1998','12/08/1998','60cf14549999fc3c48160d6a'`
        
// client.query(
//     `CALL genre_insert_data(${final})`,
//     (err, res) => {
//       console.log(err, res);
//     //   client.end();
//     }
//   );
