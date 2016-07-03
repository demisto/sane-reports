import React from 'react';
import chai from 'chai';
import * as constants from '../../src/constants/Constants';
import * as TemplateProvider from '../../templates/templateProvider';
import { mount, render, shallow } from 'enzyme';

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
