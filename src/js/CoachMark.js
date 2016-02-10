import componentHandler from 'o-component-handler';

const testDiv = document.createElement('div');
const internalText = ('textContent' in testDiv) ? 'textContent' : 'innerText';

function triggerEvent(elementClickedIS, eventIs, payload) {
  let event;
  if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventIs, true, true);
  } else {
    event = document.createEventObject();
    event.eventType = eventIs;
  }

  event.eventName = eventIs;
  event.data = {
    type: elementClickedIS,
    id: opts.id,
    payload: payload
  };

  if (document.createEvent) {
    element.dispatchEvent(event);
  } else {
    element.fireEvent("on" + event.eventType, event);
  }
}

export default class CoachMark {
  constructor(el, opts, cb){
    this.element = el;
		this.opts = opts;
		this.callback = cb || function (){};

    if(!this.opts){
      opts = {};
      console.warn('missing required parameter: you must include an options object');
    }
    const validPlacement = ['top', 'bottom', 'left', 'right'];
    if(!this.opts.placement || validPlacement.indexOf(this.opts.placement) < 0){
      console.warn('invalid coach-mark placement: will default to bottom');
      this.opts.placement = 'bottom';
    }
    if(!this.opts.text || this.opts.text.replace(/\s/,'') == ''){
      console.warn('missing required option: you must specify text for the coach mark');
    }
    if(!this.opts.id){
      console.warn('missing required option: you must specify an id for the coach mark');
    }

    let pos = this.createPositioner();
    let container = this.createContainer();
    let close = this.createCloseButton();
    let content = this.createContent();
    let titleText = this.createTitleText();
    let paragraph = this.createContentParagraph();

    content.className += ' o-coach-mark--' + opts.placement;
    content.appendChild(titleText);
    content.appendChild(close);

    paragraph[internalText] = opts.text;
    content.appendChild(paragraph);

    if (opts.hasBack || opts.hasNext) {
      let backNextDiv = this.createBackNext(this.opts);
      content.appendChild(backNextDiv);
		}

    if (opts.like) {
      this.createLike(content);
		}

    close.addEventListener('click', (event) => {
			container.style.visibility = 'hidden';
			this.callback(opts.id, event);
		});

    content.style.position = 'relative';
		container.appendChild(content);

    this.positionContainer(pos, content, container, this.opts);

    //Inject html - use classes to position
		pos.appendChild(container);
    container.style.visibility = 'visible';

  }
  appendPositioner(pos){
    this.element.parentNode.insertBefore(pos, this.element.nextSibling);
  }
  prependPositioner(pos){
    this.element.parentNode.insertBefore(pos, this.element);
  }
  positionContainer(pos, content, container, opts){
    container.style.visibility = 'visible';

		const featurePosition = this.element.getBoundingClientRect();
		const featureHeight = this.element.offsetHeight;

		const markHeight = content.offsetHeight + 10;
		const markWidth = container.offsetWidth;

		container.style.visibility = 'hidden';

		if (opts.placement === 'bottom') {
			container.style.left = featurePosition.left + 'px';
      this.appendPositioner(pos);
		} else if (opts.placement === 'top') {
      container.style.top = ((featureHeight + markHeight) * -1) + 'px';
      container.style.left = (featurePosition.left + window.pageXOffset) + 'px';
      this.prependPositioner(pos);
		} else if (opts.placement === 'left') {
      container.style.top = '0px';
      container.style.left = (markWidth * -1) + 'px';
      this.prependPositioner(pos);
		} else if (opts.placement === 'right') {
      container.style.top = (featureHeight * -1) + 'px';
      container.style.left = (featurePosition.right + window.pageXOffset) + 'px';
      this.appendPositioner(pos);
		}
  }
  createLike(content){
    let likeDiv;
    let feedBack;

    const hr = document.createElement('hr');
    hr.className = 'o-coach-mark--hr';
    content.appendChild(hr);

    likeDiv = document.createElement('div');
    likeDiv.className = 'o-coach-mark__like-div';
    const question = document.createElement('p');
    question.innerHTML = 'What do you think of this change?';
    likeDiv.appendChild(question);
    content.appendChild(likeDiv);
    this.appendAnchor(likeDiv, 'down', 'Not Great', 'dislike');
    this.appendAnchor(likeDiv, 'up', 'I Like It', 'like');
    feedBack = document.createElement('div');
    feedBack.className = 'o-coach-mark__feedback';
    const instructions = document.createElement('p');
    instructions.innerHTML = 'Thanks! Care to tell us more?';
    feedBack.appendChild(instructions);
    const form = document.createElement('textarea');
    const buttonBar = document.createElement('div');
    const submit = document.createElement('button');
    submit.innerHTML = 'submit';
    submit.onclick = () => {
      triggerEvent('submit', 'o-cm-submit-clicked', form.value);
    }
    const cancel = document.createElement('a');
    cancel.innerHTML = 'cancel';
    cancel.setAttribute('href', '#');
    cancel.onclick = () => {
      triggerEvent('cancel', 'o-cm-cancel-clicked');
      likeDiv.style.display = 'block';
      feedBack.style.display = 'none';
    }
    feedBack.appendChild(form);
    buttonBar.appendChild(submit);
    buttonBar.appendChild(cancel);
    feedBack.appendChild(buttonBar);
    content.appendChild(feedBack);
    return true;
  }
  createBackNext(opts){
    const backNextDiv = document.createElement('div');
    let back = document.createElement('button');
    const backSpan = document.createElement('span');
    let next = document.createElement('button');
    const nextSpan = document.createElement('span');
    const totalOfCoachMarksSpan = document.createElement('span');

    back.setAttribute('type', 'button');
    back.className = 'o-coach-mark__button-space';

    backSpan[internalText] = 'Back';
    back.appendChild(backSpan);
    //build next button
    next.setAttribute('type', 'button');
    next.className = 'o-coach-mark__next-button';

    nextSpan[internalText] = 'Next';
    next.appendChild(nextSpan);

    totalOfCoachMarksSpan.className = 'o-coach-mark__total-coachmarks';
    totalOfCoachMarksSpan[internalText] = opts.currentCM + '/' + opts.totalCM;

    backNextDiv.appendChild(back);
    backNextDiv.appendChild(next);
    backNextDiv.appendChild(totalOfCoachMarksSpan);

    eventOnClick(back);
    eventOnClick(next);

    function eventOnClick(parent) {
      let buttonIs = opts.hasNext ? 'nextButton' : 'backButton';
      parent.onclick = function(event) {
        triggerEvent(buttonIs, 'o-cm-backNext-clicked');
        event.preventDefault();
      };
    }
    return backNextDiv;
  }
  createPositioner(){
    const positioner = document.createElement('div');
		positioner.style.position = 'relative';
		positioner.style.display = 'inline-block';
    return positioner;
  }
  createContainer(){
    const container = document.createElement('div');
    container.className = 'o-coach-mark__container';
		container.style.visibility = 'hidden';
		container.style.display = 'block';
		container.style.position = 'absolute';
    return container;
  }
  createContent(){
    const content = document.createElement('div');
		content.style.margin = '0';
		content.className = 'o-coach-mark__content';
    return content;
  }
  createContentParagraph(){
    const paragraph = document.createElement('p');
    return paragraph;
  }
  createCloseButton(){
    const close = document.createElement('button');
    const closeSpan = document.createElement('span');
    close.setAttribute('type', 'button');
		close.setAttribute('aria-label', 'close');
		close.className = 'o-coach-mark__close-icon';
		closeSpan[internalText] = '✕';
		closeSpan.setAttribute('aria-hidden', 'true');
		close.appendChild(closeSpan);
    return close;
  }
  createTitleText(){
    const titleText = document.createElement('div');
		titleText.className = 'o-coach-mark__title';
    return titleText;
  }
  appendAnchor(parent, upDown, text, like) {
    const link = document.createElement('a');
    link.onclick = function(event) {
      triggerEvent(like, 'o-cm-like-clicked');
      likeDiv.style.display = 'none';
      feedBack.style.display = 'block';
      event.preventDefault();
    };
    link.innerHTML = text;
    link.className = 'o-coach-mark--link-text';
    link.setAttribute('href', '#');
    const likeImg = document.createElement('i');
    likeImg.className = 'o-coach-mark--icons fa fa-thumbs-o-' + upDown;
    likeImg.setAttribute('aria-hidden', 'true');
    link.insertBefore(likeImg, link.childNodes[0]);
    parent.appendChild(link);
  }
}

componentHandler.register({
  constructor: CoachMark,
  classAsString: 'CoachMark',
  cssClass: 'o-coach-mark'
});
