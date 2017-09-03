'use strict';

const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/serviceList.response');

describe('#serviceList', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service')
    .reply(200, response.serviceList);

  before(async () => {
    res = await fastly.serviceList();
  });

  it('response should be a status 200', () => {
    expect(res.status).toBe(200);
  });
  
  it('response body should exist', () => {
    expect(res.data).toExist();
  });

  it('response body should be an array', () => {
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('response body should be an array of objects', () => {
    res.data.forEach(item => {
      expect(item).toBeA('object');
    });
  });

  it('response body items should have comment, customer_id, id, name, version, and versions properties', () => {
    res.data.forEach(item => {
      expect(item).toIncludeKeys(['comment', 'customer_id', 'id', 'name', 'version', 'versions']);
    });
  });
});
