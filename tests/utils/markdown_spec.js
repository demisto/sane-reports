
import { mdReact } from 'react-markdown-demisto';
import { mdTextStyle } from '../../src/utils/markdown';
import { expect } from '../helpers/test_helper';

describe('markdown util', () => {
  it('Test text styling', () => {
    const plugins = [mdTextStyle];
    const stylingFunction = mdReact({
      disableRules: ['smartquotes', 'backticks'],
      markdownOptions: { typographer: true },
      plugins
    });

    let styled = stylingFunction('{{background:red}}(a){{background:blue}}(b)');
    expect(styled.props.children[0].props.children.length).to.be.equal(2);

    styled = stylingFunction('{{background:red}}(a(b)){{background:blue}}(b)');
    expect(styled.props.children[0].props.children.length).to.be.equal(2);

    styled = stylingFunction('{{background:red}}(a(b))(g){{background:blue}}(b)');
    expect(styled.props.children[0].props.children.length).to.be.equal(3);

    styled = stylingFunction('{{background:red}}(a(b)))(g){{background:blue}}(b)');
    expect(styled.props.children[0].props.children.length).to.be.equal(3);
  });
});
