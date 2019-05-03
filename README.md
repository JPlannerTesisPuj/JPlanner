# JPlanner

## SPRING INSTALLATION
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

---

## ANGULAR INSTALLATION

Para la instalación y creación de un nuevo proyecto en Angular 6 se deben seguir las siguientes instrucciones:
Descargar las siguientes aplicaciones
Node js: https://nodejs.org/es/ descargar la version actual
Git: https://git-scm.com/ ir al link de descarga segun sistema operativo
En la siguiente pagina se encuentran los comandos mas importantes implementados por angular cli, el cual es un ayudante de creación y puesta en marcha de Angular https://cli.angular.io/.

Tras descargar e instalar las herramientas(ambas no necesitan opciones de instalación en especifico) se instalará Angular cli con el comando


- ```npm install -g @angular/cli```

luego en consola nos dirijimos al sitio en el cual se desea crear un nuevo proyecto por ejemplo

### Para abrir el proyecto ya existente

Abrir la carpeta Angular, abrir la terminal en dicha ubicación y ejecutar:

- ```npm install``` se esperan unos minutos hasta que en la consola se indique que la instalación terminó, después digitamos

- ```npm serve --open``` en consola se nos informará en que puerto esta situado el servidor, en este caso http://localhost:4200, y este se abrirá automáticamente en el navegador por defecto

### Para crear un nuevo proyecto

cd Desktop
se nos creará en el escritorio, digitar el siguiente comando

- ```ng new my-dream-app```
se esperan unos minutos y las consola nos informa que fue creado satisfactoriamente, Angular posee un servidor interno el cual nos permite correr nuestra aplicación, para ponerlo en marcha digitamos

- ```ng serve```

en consola se nos informará en que puerto esta situado el servidor ejemplo
http://localhost:4200
Para más información dirigirse a -- https://cli.angular.io/ -- https://github.com/angular/angular-cli/wiki
Curso de Angular 6 : https://www.youtube.com/watch?v=AR1tLGQ7COs&index=3&list=LLPeAk0L7s60ebYx6LiP9fOA&t=1880s

---

## GULP

-	npm install --global gulp-cli
-	npm install --save-dev gulp@next
-	npm install gulp-sass --save-dev
-	npm install gulp-autoprefixer --save-dev

Este gulpfile se encarga de compilar todos los archivos scss del proyecto minificandolos y agregandoles un prefijo.
Cuando se cree un nuevo componente se debe cambiar la extension de su css a scss , eliminar la linea de estilos del component.ts que referencia a ese scss
y agregar el archivo scss de este componente en el gulpfile en el arreglo de sassFiles y a los imports del archivo styles.scss.

Los archivos nuevos quedan en app/styles/styles.css. La justificacion para realizar esto es que solo se van a cargar los estilos estaticos una unica vez
y el resto de veces que el sitio se cargue ya estaran cacheados, lo que aumentaria el performance en el sitio.

---

## POSTGRESQL

Para crear la base de datos primero hay que descargar e instalar PostgreSQL:

### Windows
1.  Ir a https://www.enterprisedb.com/downloads/postgres-postgresql-downloads y descargar la versión más reciente. Se recomienda descargar la versión 11. 
2.  Al momento de instalar cuando se requiera ingresar el puerto, dejar el puerto 5432. Si no está por defecto se debe colocarlo.
3.  Una vez finalizada la instalación abrir el programa *pgAdmin 4*, este abrirá una ventana en el navegador.
4.  En la parte izquierda aparecerá el *Browser*, y debajo de *Servers* aparecerá *PostgreSQL 11*, dar click derecho - Conect to Server.
5.  Dar click derecho en *Login/Group Roles*, luego *Create* y luego *Login/Group Role...*.
6.  En el modal que aparece, en el campo de *Nombre* poner *jplanner*, en la pestaña e *definition* en el campo *Password* poner *jplanner51910* y en la pestaña de *Privileges* poner las siguiente configuración:
    -   Can login?: Yes
    -   Superuser: No
    -   Create roles?: No
    -   Create databases?: Yes
    -   Update catalog?: No
    -   Inherit rights from parent roles?: Yes
    -   Can initiate streaming replication and backups?: No
    
    Dar click en *Save*.
7.  Dar click derecho en *Databases* y luego *Create* y después *Database...*.
8.  En el modal que aparece en el campo *Database* poner *restdb* y en *Owner* seleccionar *jplanner*. Dar click en *Save*.

### Linux
1.  Abrir la terminal y:
    -  Ejecutar ```sudo apt-get install postgresql```
    -  Ejecutar ```/etc/init.d/postgresql status```
    -  Ejecutar ```sudo -u postgres psql postgres``` Se entrará dentro de la consola de PostgreSQL, ejecutar el comando \password postgres y escribir la contraseña que se desee. En caso de NO QUERER contraseña sólo presionar la tecla ENTER.
    - Ejecutar ```sudo -u postgres createuser --interactive --password jplanner``` A las siguientes preguntas dar las respuesta de enfrente:
        -   Shall the new role be a superuser? (y/n) **n**
        -   Shall the new role be allowed to create databases? (y/n) **y**
        -   Shall the new role be allowed to create more new roles? (y/n) **n**
    - Abrir el archivo que se encuentra en */etc/postgresql/9.5/main/pg_hba.conf* y actualizar la siguiente información:

        ```
        # "local" is for Unix domain socket connections only
        local   all             all                                     trust
        # IPv4 local connections:
        host    all             all             127.0.0.1/32            trust
        ```

        Guardar.
    -   Ejecutar ```sudo service postgresql restart```
    -   Ejecutar ```psql -U jplanner -d restdb -W```
