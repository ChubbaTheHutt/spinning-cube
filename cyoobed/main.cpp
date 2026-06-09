#include "mainwindow.h"
#include "qglcanvas.h"

#include <QApplication>
#include <QMenuBar>
#include <QMenu>
#include <QAction>
#include <QKeySequence>
#include <QHBoxLayout>


int createMenuBar(MainWindow& w){
    qDebug() << "Menu bar initializing...";

    //MENU BAR (Move to new file?)
    QMenuBar *qmb = w.menuBar();

    //MENUS
    QMenu *fileMenu = qmb->addMenu("&File");
    QMenu *editMenu = qmb->addMenu("&Edit");
    editMenu->setTearOffEnabled(true);
    QMenu *helpMenu = qmb->addMenu("&Help");

    //submenus
    QMenu *shapesMenu = editMenu->addMenu("shapes");

    //ACTIONS
    QAction *saveActn = fileMenu->addAction("save");
    saveActn->setShortcut(Qt::CTRL | Qt::Key_P);
    QAction *loadActn = fileMenu->addAction("load");
    loadActn->setShortcut(Qt::CTRL | Qt::Key_O);
    QAction *exitActn = fileMenu->addAction("exit");
    exitActn->setShortcut(Qt::CTRL | Qt::SHIFT | Qt::Key_C);

    QAction *squareShapeActn = shapesMenu->addAction("quad");
    QAction *triShapeActn = shapesMenu->addAction("tri");
    QAction *lineShapeActn = shapesMenu->addAction("line");

    QAction *showShortcutsActn = helpMenu->addAction("show shortcuts");

    qDebug() << "Menu bar init complete";
    return 0;
}

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    createMenuBar(w);

    QWidget *topWidget = new QWidget();
    w.setCentralWidget(topWidget);

    QGLCanvas *qglc = new QGLCanvas();

    QHBoxLayout *topLayout = new QHBoxLayout(topWidget);
    topLayout->addWidget(qglc);

    w.show();
    return QApplication::exec();
}
