#include "qglcanvas.h"
#include <string>

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


    const char* vss = R"(
        #version 300 es
        vec4 in_position;

        void main(){
            gl_Position = in_position;
        }
    )";

    const char* fss = R"(
        #version 300 es
        precision highp float;

        out vec4 outColor;

        void main(){
            outColor = vec4(0.4, 0.7, 0.5, 0.0);
        }
    )";

    GLuint vertshader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertshader, 1, &vss, NULL);
    GLuint fragshader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragshader, 1, &fss, NULL);

    glCompileShader(vertshader);
    glCompileShader(fragshader);


    GLuint program = glCreateProgram();
    glAttachShader(program, vertshader);
    glAttachShader(program, fragshader);

    glDeleteShader(vertshader);
    glDeleteShader(fragshader);


    int x{1};
};