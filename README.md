# fastly-promises

> Promise based Fastly API client for Node.js

[![travis build](https://img.shields.io/travis/philippschulte/fastly-promises.svg?style=flat-square)](https://travis-ci.org/philippschulte/fastly-promises)
[![codecov coverage](https://img.shields.io/codecov/c/github/philippschulte/fastly-promises.svg?style=flat-square)](https://codecov.io/gh/philippschulte/fastly-promises)
[![npm version](https://img.shields.io/npm/v/fastly-promises.svg?style=flat-square)](https://npm.im/fastly-promises)
[![npm downloads](https://img.shields.io/npm/dm/fastly-promises.svg?style=flat-square)](https://npm.im/fastly-promises)
[![npm license](https://img.shields.io/npm/l/fastly-promises.svg?style=flat-square)](LICENSE)

[![NPM](https://nodei.co/npm/fastly-promises.png)](https://nodei.co/npm/fastly-promises/)


## Table of Contents

- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Tests](#tests)
- [Contribute](#contribute)
- [License](#license)

## Security

You'll need a [Fastly API Token](https://docs.fastly.com/api/auth#tokens) in order to use the `fastly-promises` library. I recommend to use a token with a [global scope](https://docs.fastly.com/api/auth#access) to be able to use all `fastly-promises` API methods.

## Install

This is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install fastly-promises
```

## Usage

```javascript
const fastly = require('fastly-promises');

// create one or more instances
const service_1 = fastly('token', 'service_id_1');
const serivce_2 = fastly('token', 'service_id_2');

// read/write baseURL property
console.log(service_1.request.defaults.baseURL); // https://api.fastly.com

// read/write timeout property
console.log(service_1.request.defaults.timeout); // 3000
```

### Response Schema

Each `fastly-promises` API method returns the following response object:

```javascript
{
  // the HTTP status code from the server response
  status: 200,

  // the HTTP status message from the server response
  statusText: 'OK',

  // the headers that the server responded with
  headers: {},

  // the config that was provided to axios for the request
  config: {},

  // the request that generated the response
  request: {},

  // the response that was provided by the server
  data: {}
}
```

### Promises

This example does the following:

1. Get all the versions
2. Filter out the active version
3. Get all the domains of the active version
4. Purge all the domains
5. Log the status text of each purge request

```javascript
function handler() {
  service_1.versionList()
    .then(versions => {
      const active = versions.data.filter(version => version.active === true)[0];
      return service_1.domainList(active.number);
    })
    .then(domains => {
      return Promise.all(domains.data.map(domain => service_1.purgeIndividual(domain.name)));
    })
    .then(purges => {
      purges.forEach(purge => console.log(purge.statusText));
    })
    .catch(e => {
      console.log('Shoot!');
    });
}
```

### Async/Await

This is the same example but uses the `async/await` syntax instead!

```javascript
async function handler() {
  try {
    const versions = await serivce_2.versionList();
    const active = versions.data.filter(version => version.active === true)[0];
    const domains = await serivce_2.domainList(active.number);
    const purges = await Promise.all(domains.data.map(domain => serivce_2.purgeIndividual(domain.name)));

    purges.forEach(purge => console.log(purge.statusText));
  } catch (e) {
    console.log('Shoot!');
  }
}
```

## API

- [constructor(token, service_id)](#constructor)
  - [.request.defaults.baseURL](#baseURL)
  - [.request.defaults.timeout](#timeout)
  - [.purgeIndividual(url)](#purgeIndividual)
  - [.purgeAll()](#purgeAll)
  - [.purgeKey(key)](#purgeKey)
  - [.purgeKeys(keys)](#purgeKeys)
  - [.softPurgeIndividual(url)](#softPurgeIndividual)
  - [.softPurgeKey(key)](#softPurgeKey)
  - [.dataCenters()](#dataCenters)
  - [.publicIpList()](#publicIpList)
  - [.edgeCheck(url)](#edgeCheck)
  - [.serviceList()](#serviceList)
  - [.versionList()](#versionList)
  - [.domainList(version)](#domainList)
  - [.domainCheckAll(version)](#domainCheckAll)

<a name="constructor"></a>

### [constructor(token, service_id)](https://github.com/philippschulte/fastly-promises/blob/a9ca4b9f69bca63c62ca2be0ee5e8752c4536adf/src/index.js#L15)

*Method for creating and initializing a new fastly-promises instance.*

**Example**:

```javascript
const fastly = require('fastly-promises');

// create one or more instances
const instance = fastly('token', 'service_id');
```

**Kind**: method  
**Param**: token => `string`  
**Param**: service_id => `string`  
**Return**: instance => `object`

<a name="baseURL"></a>

### [.request.defaults.baseURL](https://github.com/philippschulte/fastly-promises/blob/a9ca4b9f69bca63c62ca2be0ee5e8752c4536adf/src/index.js#L18)

*The main entry point for the Fastly API.*

**Example**:

```javascript
// read/write baseURL property
console.log(instance.request.defaults.baseURL); // https://api.fastly.com

// in case the fastly api main entry point changes one day
instance.request.defaults.baseURL = 'https://api.fastly.com/v1';
```

**Kind**: property  
**Return**: url => `string`

<a name="timeout"></a>

### [.request.defaults.timeout](https://github.com/philippschulte/fastly-promises/blob/a9ca4b9f69bca63c62ca2be0ee5e8752c4536adf/src/index.js#L19)

*The number of milliseconds before the request times out.*

**Example**:

```javascript
// read/write timeout property
console.log(instance.request.defaults.timeout); // 3000

instance.request.defaults.timeout = 5000;
```

**Kind**: property  
**Return**: milliseconds => `number`

<a name="purgeIndividual"></a>

### [.purgeIndividual(url)](https://docs.fastly.com/api/purge#purge_3aa1d66ee81dbfed0b03deed0fa16a9a)

*Instant Purge an individual URL.*

**Example**:

```javascript
instance.purgeIndividual('www.example.com')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: url => `string`  
**Return**: schema => `promise`

<a name="purgeAll"></a>

### [.purgeAll()](https://docs.fastly.com/api/purge#purge_bee5ed1a0cfd541e8b9f970a44718546)

*Instant Purge everything from a service.*

**Example**:

```javascript
instance.purgeAll()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Return**: schema => `promise`

<a name="purgeKey"></a>

### [.purgeKey(key)](https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230)

*Instant Purge a particular service of items tagged with a Surrogate Key.*

**Example**:

```javascript
instance.purgeKey('key_1')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: key => `string`  
**Return**: schema => `promise`

<a name="purgeKeys"></a>

### [.purgeKeys(keys)](https://docs.fastly.com/api/purge#purge_db35b293f8a724717fcf25628d713583)

*Instant Purge a particular service of items tagged with Surrogate Keys in a batch.*

**Example**:

```javascript
instance.purgeKeys(['key_2', 'key_3', 'key_4'])
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: keys => `array`  
**Return**: schema => `promise`

<a name="softPurgeIndividual"></a>

### [.softPurgeIndividual(url)](https://docs.fastly.com/api/purge#soft_purge_0c4f56f3d68e9bed44fb8b638b78ea36)

*Soft Purge an individual URL.*

**Example**:

```javascript
instance.softPurgeIndividual('www.example.com/images')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: url => `string`  
**Return**: schema => `promise`

<a name="softPurgeKey"></a>

### [.softPurgeKey(key)](https://docs.fastly.com/api/purge#soft_purge_2e4d29085640127739f8467f27a5b549)

*Soft Purge a particular service of items tagged with a Surrogate Key.*

**Example**:

```javascript
instance.softPurgeKey('key_5')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: key => `string`  
**Return**: schema => `promise`

<a name="dataCenters"></a>

### [.dataCenters()](https://docs.fastly.com/api/tools#datacenter_1c8d3b9dd035e301155b44eae05e0554)

*Get a list of all Fastly datacenters.*

**Example**:

```javascript
instance.dataCenters()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Return**: schema => `promise`

<a name="publicIpList"></a>

### [.publicIpList()](https://docs.fastly.com/api/tools#public_ip_list_ef2e9900a1c9522b58f5abed92ec785e)

*Fastly's services IP ranges.*

**Example**:

```javascript
instance.publicIpList()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Return**: schema => `promise`

<a name="edgeCheck"></a>

### [.edgeCheck(url)](https://docs.fastly.com/api/tools#content_4d2d4548b29c7661e17ebe7098872d6d)

*Retrieve headers and MD5 hash of the content for a particular URL from each Fastly edge server.*

**Example**:

```javascript
instance.edgeCheck('api.example.com')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: url => `string`  
**Return**: schema => `promise`

<a name="serviceList"></a>

### [.serviceList()](https://docs.fastly.com/api/config#service_74d98f7e5d018256e44d1cf820388ef8)

*List all services.*

**Example**:

```javascript
instance.serviceList()
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Return**: schema => `promise`

<a name="versionList"></a>

### [.versionList()](https://docs.fastly.com/api/config#version_dfde9093f4eb0aa2497bbfd1d9415987)

*List the versions for a particular service.*

**Example**:

```javascript
instance.versionList()
  .then(res => {
    const active = res.data.filter(version => version.active === true);
    console.log(active);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Return**: schema => `promise`

<a name="domainList"></a>

### [.domainList(version)](https://docs.fastly.com/api/config#domain_6d340186666771f022ca20f81609d03d)

*List all the domains for a particular service and version.*

**Example**:

```javascript
instance.domainList('182')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: version => `string`  
**Return**: schema => `promise`

<a name="domainCheckAll"></a>

### [.domainCheckAll(version)](https://docs.fastly.com/api/config#domain_e33a599694c3316f00b6b8d53a2db7d9)

*Checks the status of all domains for a particular service and version.*

**Example**:

```javascript
instance.domainCheckAll('182')
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err.message);
  });
```

**Kind**: method  
**Param**: version => `string`  
**Return**: schema => `promise`

## Tests

To run the test suite, first install the dependencies, then run the [`npm test` command](https://docs.npmjs.com/cli/test):

```bash
$ npm install
$ npm test
```

## Contribute

PRs accepted. I am open to suggestions in improving this library. Commit by:

```bash
$ npm run commit
```

## License

Licensed under the [MIT License](LICENSE) © 2017 Philipp Schulte
