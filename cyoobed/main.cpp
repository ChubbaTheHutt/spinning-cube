#include "mainwindow.h"

#include <QApplication>
#include <QMenuBar>
#include <QMenu>
#include <QAction>
#include <QKeySequence>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;

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
    QAction *exitActn = fileMenu->addAction("exit");

    QAction *squareShapeActn = shapesMenu->addAction("quad");
    QAction *triShapeActn = shapesMenu->addAction("tri");
    QAction *lineShapeActn = shapesMenu->addAction("line");

    QAction *showShortcutsActn = helpMenu->addAction("show shortcuts");


    w.show();
    return QApplication::exec();
}
