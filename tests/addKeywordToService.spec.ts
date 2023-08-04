import { addKeywordToService } from '../utils/keywords';

describe('addKeywordToService', () => {
  it('should add a keyword to an empty string', () => {
    expect(addKeywordToService('', 'foo')).toEqual('foo');
  });

  it('should separate keywords by comma', () => {
    expect(addKeywordToService('foo', 'bar')).toEqual('foo, bar');
  });

  it('should separate new keywords by comma if there are more than one, separated by comma', () => {
    expect(addKeywordToService('foo', 'bar baz')).toEqual('foo, bar, baz');
  });

  it('should not add a keyword if it already exists', () => {
    expect(addKeywordToService('foo', 'foo')).toEqual('foo');
  });

  it('should not add a keyword if it already exists, even if it is separated by comma', () => {
    expect(addKeywordToService('foo', 'foo, bar')).toEqual('foo, bar');
  });

  it('should not add a keyword if it already exists, even if it is separated by comma and there are more than one', () => {
    expect(addKeywordToService('foo', 'foo, bar, baz')).toEqual(
      'foo, bar, baz'
    );
  });

  it('should not add a keyword if it already exists, even if it is separated by comma and there are more than one, and the new keyword is separated by comma', () => {
    expect(addKeywordToService('foo', 'foo, bar, baz, qux')).toEqual(
      'foo, bar, baz, qux'
    );
  });

  it('should not add a keyword if it already exists, even if it is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one', () => {
    expect(addKeywordToService('foo, bar', 'foo, bar, baz, qux')).toEqual(
      'foo, bar, baz, qux'
    );
  });

  it('should not add a keyword if it already exists, even if it is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one', () => {
    expect(
      addKeywordToService('foo, bar, baz', 'foo, bar, baz, qux, quux')
    ).toEqual('foo, bar, baz, qux, quux');
  });

  it('should not add a keyword if it already exists, even if it is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one, and the new keyword is separated by comma and there are more than one', () => {
    expect(
      addKeywordToService('foo, bar, baz, qux', 'foo, bar, baz, qux, quux')
    ).toEqual('foo, bar, baz, qux, quux');
  });

  it('should add words correctly if are some of the new words are separated by more than one comma', () => {
    expect(addKeywordToService('foo', 'bar,, baz')).toEqual('foo, bar, baz');
  });

  it('should add words correctly if are some of the new words are separated by more than one comma and there are more than one', () => {
    expect(addKeywordToService('foo', 'bar,, baz,, qux')).toEqual(
      'foo, bar, baz, qux'
    );
  });
});
