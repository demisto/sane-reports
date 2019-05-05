import React from 'react';
import chai from 'chai';
import * as constants from '../../src/constants/Constants';
import * as TemplateProvider from '../../templates/templateProvider';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });
const { assert, expect, should } = chai;

chai.should();

export {
    React,
    chai,
    assert,
    expect,
    should,
    constants,
    TemplateProvider,
    mount,
    render,
    shallow
};
