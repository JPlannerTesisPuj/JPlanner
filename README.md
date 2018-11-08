# JPlanner

Entrar al siguiente link:
-https://spring.io/tools

En este van a encontrar diferentes opciones de descarga, Spring Tools 4 para Eclipse, Visual Studio Code o Atom IDE.
Seleccionan la opción de Eclipse para el sistema operativo que tengan en 64-bit. (En mi caso fue Windows)

Cuando descarguen el IDE, dentro de la carpeta hay un ejecutable que se llama "SpringToolSuite4". Si no tienen problemas,
vayan a la línea que contiene una cara feliz :D.

Si tienen problemas para ejecutarlo, por ejemplo, java was started but returned exit code=13. Es que no tienen configurado
el jdk versión 64-bit, para eso tienen que entrar en el archivo "SpringToolSuite4.ini" que está en la carpte del IDE, que
acaban de descargar y colocar lo siguiente:

-startup
plugins/org.eclipse.equinox.launcher_1.5.100.v20180827-1352.jar
--launcher.library
plugins/org.eclipse.equinox.launcher.win32.win32.x86_64_1.1.800.v20180827-1352
-product
org.springframework.boot.ide.branding.sts4
--launcher.defaultAction
openFile
-vm                                                               <-Tienen que colocar estas dos lineas antes del -vmargs
C:\Program Files\Java\jdk1.8.0_71\jre\bin\javaw.exe               <-Acá colocan la dirección de su jdk\jre\bin\javaw.exe
                                                                    El que tengo ahí es en mi caso para que se guien.

-vmargs
-Dosgi.requiredJavaVersion=1.8
--add-modules=ALL-SYSTEM
-Xms40m
-Xmx1200m

 :D  Luego de esto, cuando logren ejecutar Spring, van a importar un proyecto Maven, y seleccionan la carpeta de este branch.

Y listo!


This is a repository where web application JPlanner is built.
