const Categorias = require("./Categoria");
const Comentarios = require("./Comentario");
const Pedidos = require("./Pedido");
const Productos = require("./Producto");
const Reply = require("./Reply");
const Role = require("./Role");
const Usuarios = require("./Usuario");

Usuarios.hasMany(Pedidos,{ foreignKey: 'usuarioId' ,defaultValue: []})

Productos.hasMany(Comentarios, { foreignKey: 'productoId' ,defaultValue: []});

Pedidos.belongsTo(Usuarios,{ foreignKey: 'usuarioId' ,defaultValue: []})

Comentarios.belongsTo(Usuarios)
Comentarios.belongsTo(Productos, { foreignKey: 'productoId', onDelete: 'CASCADE' });
Comentarios.hasMany(Reply, { foreignKey: 'comentarioId' });

Reply.belongsTo(Usuarios,{ foreignKey: 'usuarioId' ,defaultValue: []})
Reply.belongsTo(Comentarios, { foreignKey: 'comentarioId', onDelete: 'CASCADE' });


module.exports = {
    Usuarios,
    Productos,
    Categorias,
    Role,
    Pedidos,
    Comentarios,
    Reply,
}