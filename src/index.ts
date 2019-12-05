export const Greeter = (name: string) => `Hello ${name}`;

const fs = require("fs");

// convert the ip address to a decimal
// assumes dotted decimal format for input
function convertIpToDecimal(ip: string): number {
  // a not-perfect regex for checking a valid ip address
  // It checks for (1) 4 numbers between 0 and 3 digits each separated by dots (IPv4)
  // or (2) 6 numbers between 0 and 3 digits each separated by dots (IPv6)
  var ipAddressRegEx = /^(\d{0,3}\.){3}.(\d{0,3})$|^(\d{0,3}\.){5}.(\d{0,3})$/;
  var valid = ipAddressRegEx.test(ip);
  if (!valid) {
    return -1;
  }
  var dots = ip.split(".");
  // make sure each value is between 0 and 255
  for (var i = 0; i < dots.length; i++) {
    var dot = parseInt(dots[i]);
    if (dot > 255 || dot < 0) {
      return -1;
    }
  }
  if (dots.length == 4) {
    // IPv4
    return ((+dots[0] * 256 + +dots[1]) * 256 + +dots[2]) * 256 + +dots[3];
  } else if (dots.length == 6) {
    // IPv6
    return (
      ((+dots[0] * 256 + +dots[1]) * 256 + +dots[2]) * 256 +
      +dots[3] * 256 +
      +dots[4] * 256 +
      +dots[5]
    );
  }
  return -1;
}

function binSearch(start: number, end: number, ip: number): number {
  const mid = start + Math.round((end - start) / 2);
  if (end < start) {
    return -1;
  }
  if (ip < geoIpCountryEntries[mid].start_ip) {
    return binSearch(start, mid - 1, ip);
  } else if (ip > geoIpCountryEntries[mid].end_ip) {
    return binSearch(mid + 1, end, ip);
  } else {
    return mid;
  }
}

export function geoip(ip: string): string | null {
  const decimalIp = convertIpToDecimal(ip);
  if (decimalIp == -1) {
    throw `invalid ip: ${decimalIp}`;
  }
  const index = binSearch(0, geoIpCountryEntries.length, decimalIp)
  if (index == -1) {
    return null;
  } else {
    return geoIpCountryEntries[index].countrycode;
  }
}

const contents: string = fs.readFileSync("ip2country.db", "utf8");
const lines: string[] = contents.split("\n");

class CountryGeoIpEntry {
  constructor(
    public start_ip: number,
    public end_ip: number,
    public countrycode: string
  ) {}
}

let geoIpCountryEntries: CountryGeoIpEntry[] = [];

lines.forEach((line: string) => {
  const [start_ip_str, end_ip_str, countrycode] = line.split(" ");
  geoIpCountryEntries.push(
    new CountryGeoIpEntry(
      parseInt(start_ip_str),
      parseInt(end_ip_str),
      countrycode
    )
  );
});

geoIpCountryEntries = geoIpCountryEntries.sort(
  (a: CountryGeoIpEntry, b: CountryGeoIpEntry) => a.start_ip - b.start_ip
);



// $file = fopen("ip2country.db", "r") or die("Unable to open IP DB!");
// $last_modified = date("l, dS F Y, h:i a", filemtime("ip2country.zip"));
// $db_size = ceil(filesize("ip2country.zip")/1024);
// $count = 0;
// while(!feof($file)) {
//     list($start_ip[$count], $end_ip[$count], $country[$count]) = split(" ",fgets($file));
//     $count++;
// }
//     $error_code = 0;
//     list($a, $b, $c, $d) = split("\.",$ip);
//     if ((is_numeric($a) && is_numeric($b) && is_numeric($c) && is_numeric($d)) &&
//           (($a >= 0 && $a <= 255) && ($b >= 0 && $b <= 255) && ($c >= 0 && $c <= 255) && ($d >= 0 && $d <=255))){
//             $ipvalue = (int)$a*256*256*256 + (int)$b*256*256 + (int)$c*256 + (int)$d;
//         }
//     else {
//         $comment = "You entered an invalid IP address!";
//         fclose($file);
//         $error_code = 1;
//     }
//     if ($error_code == 0) {
//         $cn = $country[binSearch(0,$count-1,$ipvalue)];
//         $cn_name = "Unknown";
//         $flag = strtolower($cn);
//         $handle = fopen ("countries.txt","r");
//         while ( ($data = fgetcsv ($handle, 1000, ";")) !== FALSE ) {
//             if(trim($data[1]) == trim($cn)) {
//                 $cn_name = ucfirst(strtolower($data[0]));
//             }
//         }
//         fclose($file);
//     }
// function binSearch($start,$end,$search) {
//     global $start_ip, $end_ip;
//     $mid = $start+(int)(($end-$start)/2);
//     if ($end < $start) {
//         return -1;
//     }
//     if ($search < (int)$start_ip[$mid]) {
//         return binSearch($start, $mid-1, $search);
//     }
//     else if ($search > (int)$end_ip[$mid]) {
//         return binSearch($mid+1, $end, $search);
//       }
//     else return $mid;
// }
