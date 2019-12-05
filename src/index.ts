const fs = require('fs');
const path = require('path')

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
    throw new Error(`invalid ip: ${ip}`);
  }
  const index = binSearch(0, geoIpCountryEntries.length, decimalIp)
  if (index == -1) {
    return null;
  } else {
    return geoIpCountryEntries[index].countrycode;
  }
}

const contents: string = fs.readFileSync(path.join(__dirname, "ip2country.db"), "utf8");
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