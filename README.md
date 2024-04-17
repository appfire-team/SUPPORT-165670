### Prerequisites
* [NodeJS](https://nodejs.org/en/download/) > 18.x and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install dependencies
```
npm install
```

### Set environment variables in local
```
export BASE_URL=<Conflence instance base url>. Example https://rampatinaten.atlassian.net/wiki 
export API_KEY=<basic auth api key>. Confluence [Guide](https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/#supplying-basic-auth-headers) to create token
export SPACE_KEY=<the space key to touch and find failed pages>. Example: NHC
```

### To run the script
#### To touch the space from REST
```
npm run touch
```
Note: Please give few minutes before running below command
#### To find numbering failed pages
```
npm run findpages
```

Note: We recommend to touch the pages by space wise. You can keep update SPACE_KEY to check for respective spaces.
