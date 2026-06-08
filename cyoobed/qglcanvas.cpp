#include "qglcanvas.h"

QGLCanvas::QGLCanvas(QWidget *parent) : QOpenGLWidget{parent} {};

void QGLCanvas::initializeGL(){
    initializeOpenGLFunctions();
    glFrontFace(GL_CW);
    glEnable(GL_CULL_FACE);
    glEnable(GL_DEPTH_TEST);
};

void QGLCanvas::resizeGL(){
    int x{1};
};

void QGLCanvas::paintGL(){
    int x{1};
};