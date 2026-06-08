#ifndef QGLCANVAS_H
#define QGLCANVAS_H

#include <QWidget>
#include <QOpenGLWidget>
#include <QOpenGLFunctions>

class QGLCanvas : public QOpenGLWidget, protected QOpenGLFunctions
{
    Q_OBJECT
    public:
        explicit QGLCanvas(QWidget *parent = nullptr);

    protected:
        void initializeGL();
        void paintGL();
        void resizeGL();

    signals:
};

#endif // QGLCANVAS_H
