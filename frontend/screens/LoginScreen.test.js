import { LoginScreen } from './LoginScreen'
import { shallow, configure } from 'enzyme'
import * as renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { findByTestAttr } from '../utils/'

const login = jest.fn()
configure({ adapter: new Adapter() });

const initialState = {
    loading: false,
    success: false,
    redirect: false,
  };

//TODO Test Navigation
describe('LoginScreen Snapshot', () => {

    it('matches the snapshot', () => {
        const tree = renderer.create(
        <LoginScreen login={login} />
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('LoginScreen Units', () => {

    beforeEach(()=>{
       this.component = shallow(<LoginScreen login={login}/>)
    })

    it('Component renders properly', () => {
        const rendered = renderer.create(<LoginScreen login={login}/>).toJSON()
        expect(rendered).toBeTruthy()
    });

    it('Loading... should be displayed when loading is true', () => {
        this.component.setProps({ ...initialState, loading:true });
        const loading = findByTestAttr(this.component, 'loading')
        expect(loading.props().children).toEqual("Loading...")
    });

    it('An empty view should be displayed when loading is false', () => {
        expect(this.component).toEqual({})
    });
})