global.back_color = '#e09448';
var back_color = global.back_color;
var Ball = require('./Ball');
var GameManager = require('./GameManager');

var WINDOW_WIDTH = global.window_width;
var WINDOW_HEIGHT = global.window_height;

function Gun () {
  var BALL_RADIUS = 12;
  var rotate_angle = -90;
  var step = 10;
  var gun_ball1 = null, gun_ball2 = null, line = null, gun_body = null;
  var pivot_point = null;
  var shoot = false;
  var offset = null;
  var BALL_VELOCITY = 10;
  var ball_pos = 0;
  var curr_line = null;
  var curr_ball = null;

  this.createGun = function () {
    this.createLine();
    gun_ball2 = new Path.Circle(new Point(WINDOW_WIDTH * 0.45, WINDOW_HEIGHT * 0.6), BALL_RADIUS);
    gun_ball2.fillColor = 'red';
    gun_body = new Path.Circle(new Point(WINDOW_WIDTH * 0.4, WINDOW_HEIGHT * 0.6), WINDOW_WIDTH * 0.05);
    gun_body.fillColor = 'black';
    var hole = this.createHole(gun_body, 0.55, gun_body.bounds.center);
    gun_ball1 = this.createOneBall(gun_body);
    gun_body.removeSegment(0);
    gun_body.removeSegment(5);

    this.createGunGroup(gun_body, gun_ball1, gun_ball2, line, hole);
  };

  this.createHole = function (gun_body, size, abs_pos, color, opacity) {
    var hole = gun_body.clone();
    hole.scale(size, abs_pos);
    if (color) {
      hole.fillColor = color;
    }
    if (opacity) {
      hole.opacity = 0.5;
    }
    return hole;
  };

  this.createOneBall = function (gun_body) {
    var gun_ball1 = gun_body.clone({insert: true, deep: true});
    gun_ball1.fillColor = 'yellow';
    gun_ball1.scale(0.2);
    return gun_ball1;
  };

  this.createGunGroup = function (gun_body, gun_ball1, gun_ball2, line, hole) {
    gun = new Group([line, gun_body, gun_ball2, hole, gun_ball1]);
    pivot_point = gun.bounds.center + new Point(-350, 0);
    gun.rotate(rotate_angle, pivot_point);
  };

  this.createLine = function () {
    line = new Path();
    // line.strokeColor = 'black';
    line.add(new Point(WINDOW_WIDTH * 0.45, WINDOW_HEIGHT * 0.6));
    line.add(new Point(WINDOW_WIDTH, WINDOW_HEIGHT * 0.6));
    offset = line.length / this.getNumOffset(BALL_VELOCITY);
  };

  this.flipColors = function () {
    var curr_color = gun_ball1.fillColor;
    gun_ball1.fillColor = gun_ball2.fillColor;
    gun_ball2.fillColor = curr_color;
  };
  this.move = function () {
    var self = this;
    view.onKeyDown = function (event) {
      if (event.key == 'right') {
        gun.rotate(step, pivot_point);
      }
      else if (event.key == 'left') {
        gun.rotate(-step, pivot_point);
      }
      else if ((event.key == 'up' || event.key == 'down') && !shoot) {
        self.flipColors();
      }
      else if (event.key == 'space') {
        self.startShooting();
      }
    };

    view.onMouseMove = function (event) {

      /*
       var rotate = event.point.angle / 10;
       if (event.point.x < WINDOW_WIDTH/2) {
       gun.rotate(-rotate, pivot_point);
       }
       else {
       gun.rotate(rotate, pivot_point);
       }
       */

    };
    view.onClick = function (event) {
      self.startShooting();
    };
  };

  this.startShooting = function () {
    if (!curr_ball) {
      this.createCurrLine();
      this.createCurrBall();
      shoot = true;
    }
  };

  this.createCurrLine = function () {
    curr_line = new Path();
    //   curr_line.strokeColor = 'black';
    curr_line.add(gun.children[0].getPointAt(0));
    curr_line.add(gun.children[0].getPointAt(gun.children[0].length));
  };

  this.createCurrBall = function () {
    curr_ball = new Ball.Ball(null, gun.children[2].position, BALL_RADIUS, gun.children[2].fillColor);
    gun_ball2.fillColor = back_color;
    GameManager.Instance.moveChain = false;
  };

  this.getNumOffset = function (velocity) {
    return line.length / velocity;
  };

  this.getBallsPositionOnLine = function (ball_pos) {

    return curr_line.getPointAt(ball_pos);

  };

  this.removeCurrBall = function () {
    /*
     if (curr_ball) {

     console.log("path.position.x: ", path.position.x);
     console.log("WINDOW_WIDTH: ", WINDOW_WIDTH);
     console.log("res", path.position.x > WINDOW_WIDTH);
     }
     */
    if (curr_ball) {
      var path = curr_ball.getPath();
      if (path.position.x <= 0 || path.position.x > WINDOW_WIDTH
        || path.position.y <= 0 || path.position.y > WINDOW_HEIGHT) {
        gun_ball2.fillColor = 'red';
        path.remove();
        curr_line.remove();
        curr_ball = null;
        shoot = false;
        ball_pos = 0;
      }
    }
  };

  this.shoot = function () {
    if (shoot) {
      ball_pos += offset;
      curr_ball.move(this.getBallsPositionOnLine(ball_pos));
      this.removeCurrBall();
    }

  };

  this.getGunBall = function () {
    return curr_ball;
  };

  var gun = null;
  this.createGun();

}

module.exports.Gun = Gun;