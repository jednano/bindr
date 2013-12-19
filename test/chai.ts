///<reference path='../vendor/dt-sinon-chai/sinon-chai.d.ts'/>
import chai = require('chai');
chai.use(require('sinon-chai'));
export var expect: SinonExpectShouldStatic = <any>chai.expect;
