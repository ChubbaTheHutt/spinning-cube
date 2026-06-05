#include "mainwindow.h"

#include <QApplication>
#include <QMenuBar>
#include <QMenu>
#include <QAction>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;

    QMenuBar qmb(&w);

    QMenu file_menu("file", &qmb);
    QMenu edit_menu("edit", &qmb);
    QMenu help_menu("help", &qmb);

    qmb.show();
    w.show();
    return QApplication::exec();
}
