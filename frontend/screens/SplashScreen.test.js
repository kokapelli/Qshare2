import {SplashScreen} from './SplashScreen'
import { shallow, configure } from 'enzyme'
import * as renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { findByTestAttr } from '../utils/'

//TODO Test so that navigation works onClick
//Required for jest to work
const navigation = { getParam: jest.fn((x,y) => null) };
const clientLogin = jest.fn()

configure({ adapter: new Adapter() });

describe('SplashScreen Snapshot', () => {

    it('matches the snapshot', () => {
        const tree = renderer.create(
        <SplashScreen clientLogin={clientLogin} navigation={navigation}/>
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('SplashScreen Units', () => {

    it('component renders properly', () => {
        const rendered = renderer.create(<SplashScreen clientLogin={clientLogin} navigation={navigation}/>).toJSON()
        expect(rendered).toBeTruthy()
    });

    it('should press Hosting button', () => {
        const component = shallow(<SplashScreen clientLogin={clientLogin} navigation={navigation}/>)
        const touchable = findByTestAttr(component, 'host')
        expect(touchable.exists()).toEqual(true) 
        expect(touchable.simulate('click')).toBeDefined()
    })

    it('should press guest button', () => {
        const component = shallow(<SplashScreen clientLogin={clientLogin} navigation={navigation}/>)
        const touchable = findByTestAttr(component, 'guest')
        expect(touchable.exists()).toEqual(true) 
        expect(touchable.simulate('click')).toBeDefined()
    })
})