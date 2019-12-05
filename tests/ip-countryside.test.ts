import { expect } from "chai";

const ipcountryside = require('../lib/index');

describe('ipcountryside', function() {
  it('invalid ip', function() {
    expect(() => ipcountryside.geoip('149.89.1')).to.throw(Error);
  }); 
  it('private ip', function() {
    expect(ipcountryside.geoip('127.0.0.1')).equal(null)
  }); 
  it('US ip', function() {
    expect(ipcountryside.geoip('149.89.1.24')).equal('US')
  }); 
  it('a bunch of IPs', function() {
    expect(ipcountryside.geoip('219.140.103.16')).equal('CN')
    expect(ipcountryside.geoip('157.11.186.26')).equal('JP')
    expect(ipcountryside.geoip('98.171.134.181')).equal('US')
    expect(ipcountryside.geoip('92.169.249.189')).equal('FR')
    expect(ipcountryside.geoip('113.164.106.97')).equal('VN')
    expect(ipcountryside.geoip('143.255.137.53')).equal('AR')
  }); 
});