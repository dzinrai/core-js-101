/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
  return this;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const newObj = Object.create(proto);
  [...Object.keys(obj)].forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor() {
    this.prot = {
      el: this.el,
      elID: this.elID,
      elClass: this.elClass,
      elAttrs: this.elAttrs,
      elPseudoClass: this.elPseudoClass,
      elPseudoElement: this.elPseudoElement,
      element: this.element,
      id: this.id,
      class: this.class,
      attr: this.attr,
      pseudoClass: this.pseudoClass,
      pseudoElement: this.pseudoElement,
      combine: this.combine,
      stringify: this.stringify,
    };
  }

  element(value) {
    if (this.el) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.elID || this.elAttrs || this.elClass || this.elPseudoClass || this.elPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const obj = Object.create(this.prot);
    obj.el = value;
    return obj;
  }

  id(value) {
    if (this.elID) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.elAttrs || this.elClass || this.elPseudoClass || this.elPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const obj = Object.create(this);
    obj.elID = value;
    return obj;
  }

  class(value) {
    if (this.elAttrs || this.elPseudoClass || this.elPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const obj = Object.create(this);
    if (obj.elClass) obj.elClass.push(value);
    else obj.elClass = [value];
    return obj;
  }

  attr(value) {
    if (this.elPseudoClass || this.elPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const obj = Object.create(this);
    if (obj.elAttrs) obj.elAttrs.push(value);
    else obj.elAttrs = [value];
    return obj;
  }

  pseudoClass(value) {
    if (this.elPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const obj = Object.create(this);
    if (obj.elPseudoClass) obj.elPseudoClass.push(value);
    else obj.elPseudoClass = [value];
    return obj;
  }

  pseudoElement(value) {
    if (this.elPseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    const obj = Object.create(this);
    obj.elPseudoElement = value;
    return obj;
  }

  combine(selectors1, combinator, selectors2) {
    const comb = ' '.concat(combinator).concat(' ');
    const s1 = selectors1.stringify();
    const s2 = selectors2.stringify();
    const combined = s1.concat(comb).concat(s2);
    return {
      combined,
      selectors1,
      selectors2,
      stringify: this.stringify,
    };
  }

  stringify() {
    let resultStr = '';
    if (this.combined) return this.combined;
    if (this.el) resultStr = resultStr.concat(this.el);
    if (this.elID) resultStr = resultStr.concat('#').concat(this.elID);
    if (this.elClass && this.elClass.length) {
      this.elClass.forEach((s) => {
        resultStr = resultStr.concat('.').concat(s);
      });
    }
    if (this.elAttrs && this.elAttrs.length) {
      resultStr = resultStr.concat('[');
      resultStr = resultStr.concat(this.elAttrs[0]);
      resultStr = resultStr.concat(']');
    }
    if (this.elPseudoClass && this.elPseudoClass.length) {
      this.elPseudoClass.forEach((s) => {
        resultStr = resultStr.concat(':').concat(s);
      });
    }
    if (this.elPseudoElement) {
      resultStr = resultStr.concat('::').concat(this.elPseudoElement);
    }
    return resultStr;
  }
}
const cssSelectorBuilder = new CssSelectorBuilder();


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
