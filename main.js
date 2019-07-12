window.onload = () => {
    
    
    let zoom = 1;
    let currentUser = '01';

    let totalRooms = ['product-04-X06-C','product-04-X06-D','product-04-X03-C','product-04-Y04-D','product-04-Y04-C','product-04-Y06-D','product-04-Y06-C','product-04-Y06-H','product-04-Y06-G','product-04-Y09-D','product-04-Y09-C','product-04-Y11-D','product-04-Y11-C','product-04-Y13-D','product-04-Y13-C','product-04-X13-D','product-04-X13-C','product-04-X-11-I','product-04-X11-C','product-04-X09-C','product-04-X09-D','product-04-X07-G', 'product-04-X11-D', 'product-04-X03-D', 'product-04-Y09-I', 'product-04-Y06-I'];

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    let bookedSquaresArr = [
        {
            roomId: 'product-04-Y06-I',
            userId: '01'
        },
        {
            roomId: 'product-04-X06-C',
            userId: '01'
        },
        {
            roomId: 'product-04-X11-D',
            userId: '02'
        },
        {
            roomId: 'product-04-X03-D',
            userId: '03'
        },
        {
            roomId: 'product-04-Y09-I',
            userId: '05'
        }
    ];

    let freeRooms = totalRooms.diff(bookedSquaresArr.map(val => val.roomId));

    let currentUserColor = 'blue';
    let freeRoomsColor = 'green';
    let bookedAnotherUserColor = 'red';

    let zoomStepView = document.getElementById("zoom");
    let pointerView = document.getElementById('pointerView')

    let obj = document.getElementById("svgObj1");
    let svgDocument = obj.contentDocument;
    let svgInn = svgDocument.getElementById("svg1");

    let pointer = svgDocument.getElementById('pointer');

    let roomNo = document.getElementById("roomNo");
    let bookedByCurrent = document.getElementById("bookedByCurrent");
    let bookedByAnother = document.getElementById("bookedByAnother");
    let alert = document.getElementById("alert");
    
    svgInn.addEventListener("click", click);

    showBookedSquares();
    lightBookedSquares();
    lightFreeRooms();

    function  lightFreeRooms() {
        freeRooms.forEach(el => {
            let elSquare = svgDocument.getElementById(el);
            elSquare.firstElementChild.style.cssText = `fill: ${freeRoomsColor}; opacity: 0.7`;
        })
    }

    function lightBookedSquares() {
        bookedSquaresArr.forEach(el => {
            let elSquare = svgDocument.getElementById(el.roomId);
            if(el.userId === currentUser) {
                elSquare.firstElementChild.style.cssText = `fill: ${currentUserColor}; opacity: 0.7`;
            } else {
                elSquare.firstElementChild.style.cssText = `fill: ${bookedAnotherUserColor}; opacity: 0.7`;
            }
        })
    }

    function showCurrentSquare(id) {
        roomNo.innerText = id;
    }

    function showBookedSquares() {
        let currentBooked = bookedSquaresArr.filter(val => val.userId === currentUser).map(val => val.roomId).toString();;
        let anotherBooked = bookedSquaresArr.filter(val => val.userId !== currentUser).map(val => val.roomId).toString();
        bookedByCurrent.innerText = currentBooked;
        bookedByAnother.innerText = anotherBooked;
    }

    function bookSquare(id) {
        bookedSquaresArr.push({roomId: id,  userId: currentUser});
    }

    function unbookSquare(index) {
        bookedSquaresArr.splice(index, 1);
    }

    function getBookedIndex(id) {
        let isBookedByCurrentUser;
        let index = bookedSquaresArr.findIndex(val => {
            isBookedByCurrentUser = (val.userId === currentUser)? true: false
            return val.roomId === id
        })
        return {index, isBookedByCurrentUser}
    }
//-----------------Click on cell---------------------------
    function click(e) {
        let squareId = e.target.parentElement.id;
        showCurrentSquare(squareId);
        
        if(totalRooms.indexOf(squareId) === -1) {
            console.log('Not a room');
            alert.innerText = ' Not a room';
            return
        }

        let {index, isBookedByCurrentUser} = getBookedIndex(squareId);
        if(index > -1 && isBookedByCurrentUser) {
            unbookSquare(index);
            freeRooms.push(squareId);
            e.target.style.cssText = `fill: ${freeRoomsColor}; opacity: 0.7`;
            alert.innerText = '';
        } else if(index > -1 && !isBookedByCurrentUser) {
            console.log('Its not your room');
            alert.innerText = ' Not you booked this room'
            
        } else {
            bookSquare(squareId);
            e.target.style.cssText =  `fill: ${currentUserColor}; opacity: 0.7`;
            alert.innerText = '';
        }
        showBookedSquares();
    }

//---------------Pointer------------------------
        svgInn.addEventListener('mousemove', function(event) {
        pointerView.innerHTML = event.clientX + ' : ' + event.clientY;
    });
//---------------ZOOM------------------------
    svgInn.onwheel = ZoomInOut;

    function ZoomInOut(e) {
        let wBox = svgInn.getAttribute('width');
        let hBox = svgInn.getAttribute('height');
        console.log(hBox, wBox);
        let [x, y, w, h] = svgInn.getAttribute('viewBox').split(' ');

        let zoomStep = 1.5;

        if(e.deltaY > 0) {
            x -= e.clientX / wBox * (w * zoomStep - w);
            y -= e.clientY / hBox * (h * zoomStep - h);
            w *= zoomStep;
            h *= zoomStep;
            zoom *= zoomStep;

        } else {

            x -= e.clientX / wBox * (w / zoomStep - w);
            y -= e.clientY / hBox * (h / zoomStep - h);
            w /= zoomStep;
            h /= zoomStep;
            zoom /= zoomStep;
            
        }
        zoomStepView.innerText = zoom;
        let newData = `${+x} ${+y} ${+w} ${+h}`;
        svgInn.setAttribute('viewBox', newData);
        console.log(zoom);

        

        if(zoom < 0.7) {
            console.log('show temperature');
            console.log(pointer.getAttribute('style'));
            pointer.setAttribute('style', 'opacity:1');
            console.log(pointer.getAttribute('style'));
        } else {
            console.log('hide temperature');
            console.log(pointer.getAttribute('style'));
            pointer.setAttribute('style', 'opacity:0');
            console.log(pointer.getAttribute('style'));
        }
    }

    //---------------PAN------------------------

    if (window.PointerEvent) {
        svgInn.addEventListener('pointerdown', onPointerDown);
        svgInn.addEventListener('pointerup', onPointerUp);
        svgInn.addEventListener('pointerleave', onPointerUp);
        svgInn.addEventListener('pointermove', onPointerMove);
    } else {
    svgInn.addEventListener('mousedown', onPointerDown);
    svgInn.addEventListener('mouseup', onPointerUp);
    svgInn.addEventListener('mouseleave', onPointerUp);
    svgInn.addEventListener('mousemove', onPointerMove);

    svgInn.addEventListener('touchstart', onPointerDown);
    svgInn.addEventListener('touchend', onPointerUp);
    svgInn.addEventListener('touchmove', onPointerMove);
    }

    let point = svgInn.createSVGPoint();
    function getPointFromEvent (event) {
    
    if (event.targetTouches) {
        point.x = event.targetTouches[0].clientX;
        point.y = event.targetTouches[0].clientY;
    } else {
        point.x = event.clientX;
        point.y = event.clientY;
    }    
    
    let invertedSVGMatrix = svgInn.getScreenCTM().inverse();    
    return point.matrixTransform(invertedSVGMatrix);
    }

    let isPointerDown = false;
    let pointerOrigin;

    function onPointerDown(event) {
    isPointerDown = true;  
    
    pointerOrigin = getPointFromEvent(event);
    }

    let viewBox = svgInn.viewBox.baseVal;

    function onPointerMove (event) {
    
    if (!isPointerDown) {
        return;
    }
    
    event.preventDefault();

    let pointerPosition = getPointFromEvent(event);
    
    viewBox.x -= (pointerPosition.x - pointerOrigin.x);
    viewBox.y -= (pointerPosition.y - pointerOrigin.y);
    }

    function onPointerUp() {
    isPointerDown = false;
    }


//////////////////// For test


    let obj1 = document.getElementById("svgObj2");
    let svgDocument1 = obj1.contentDocument;
    let svgInn1 = svgDocument1.getElementById("svg2");

    //---------------ZOOM------------------------

    svgInn1.onwheel = ZoomInOut2;

    function ZoomInOut2(e) {
        let [x, y, w, h] = svgInn1.getAttribute('viewBox').split(' ');

        let zoomStep = 1.5;

        if(e.deltaY > 0) {
            x -= e.clientX / 550 * (w * zoomStep - w);
            y -= e.clientY / 900 * (h * zoomStep - h);
            w *= zoomStep;
            h *= zoomStep;

        } else {

            x -= e.clientX / 550 * (w / zoomStep - w);
            y -= e.clientY / 900 * (h / zoomStep - h);
            w /= zoomStep;
            h /= zoomStep;
            zoom /= zoomStep;
        }
        
        let newData = `${+x} ${+y} ${+w} ${+h}`;
        svgInn1.setAttribute('viewBox', newData);
    }

    //---------------PAN------------------------

    if (window.PointerEvent) {
        svgInn1.addEventListener('pointerdown', onPointerDown2);
        svgInn1.addEventListener('pointerup', onPointerUp2);
        svgInn1.addEventListener('pointerleave', onPointerUp2);
        svgInn1.addEventListener('pointermove', onPointerMove2);
    } else {
    svgInn1.addEventListener('mousedown', onPointerDown2);
    svgInn1.addEventListener('mouseup', onPointerUp2);
    svgInn1.addEventListener('mouseleave', onPointerUp2);
    svgInn1.addEventListener('mousemove', onPointerMove2);

    svgInn1.addEventListener('touchstart', onPointerDown2);
    svgInn1.addEventListener('touchend', onPointerUp2);
    svgInn1.addEventListener('touchmove', onPointerMove2);
    }

    let point1 = svgInn1.createSVGPoint();
    function getPointFromEvent2 (event) {
    
    if (event.targetTouches) {
        point1.x = event.targetTouches[0].clientX;
        point1.y = event.targetTouches[0].clientY;
    } else {
        point1.x = event.clientX;
        point1.y = event.clientY;
    }    
    
    let invertedSVGMatrix1 = svgInn1.getScreenCTM().inverse();    
    return point1.matrixTransform(invertedSVGMatrix1);
    }

    let isPointerDown1 = false;
    let pointerOrigin1;

    function onPointerDown2(event) {
    isPointerDown1 = true;  
    
    pointerOrigin1 = getPointFromEvent2(event);
    }

    let viewBox1 = svgInn1.viewBox.baseVal;

    function onPointerMove2 (event) {
    
    if (!isPointerDown1) {
        return;
    }
    
    event.preventDefault();

    let pointerPosition = getPointFromEvent2(event);
    
    viewBox1.x -= (pointerPosition.x - pointerOrigin1.x);
    viewBox1.y -= (pointerPosition.y - pointerOrigin1.y);
    }

    function onPointerUp2() {
    isPointerDown1 = false;
    }
}