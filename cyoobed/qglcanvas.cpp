#include "qglcanvas.h"

QGLCanvas::QGLCanvas(QWidget *parent) : QOpenGLWidget{parent}
{
    qDebug() << "gl canvas initialized";
};

void QGLCanvas::initializeGL(){
    initializeOpenGLFunctions();
    glFrontFace(GL_CW);
    glEnable(GL_CULL_FACE);
    glEnable(GL_DEPTH_TEST);
    glClearColor(0.2f, 0.2f, 1.f, 1.0f);
};

void QGLCanvas::resizeGL(int w, int h){
    glViewport(0, 0, w, h);
    int x{1};
};

void QGLCanvas::paintGL(){
    glClear(GL_COLOR_BUFFER_BIT);

    int x{1};
};