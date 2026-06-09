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
        void initializeGL() override;
        void paintGL() override;
        void resizeGL(int w, int h) override;

    signals:
};

#endif // QGLCANVAS_H
