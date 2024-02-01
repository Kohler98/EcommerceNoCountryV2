const PDF = require('pdfkit-construct')
 
const excel = require('excel4node');
 
const XLSX = require('xlsx');
const generarFactura = (pedido = {}, stream) =>{

    try {
        const {productos} = pedido
        let total = 0

        productos.forEach(producto => {
            total+=producto.precio*producto.cantidad
        });

        const doc = new PDF({
            bufferPages:true
        });

        doc.on('data',(data)=>(stream.write(data)))
        doc.on('end',()=>(stream.end()))

        doc.setDocumentHeader({
            height:'28'
        },()=>{
            doc.fill('#0000CD')
            .fontSize(15)
            .text('TechZone',{
                width:420,
                align:'center',
    
                
            })
            doc.fontSize(12)
            doc.fill('#000000')
            doc.text(`Datos del comprador:`,{
                width:420,
                align:'left',
                
            })
            doc.text(`ID de Factura : ${pedido.id}`,{
                width:420,
                align:'left',
                
            })
            doc.text(`Comprador/a : ${pedido.nombre} ${pedido.apellido}`,{
                width:420,
                align:'left',
                
            })
            doc.text(`Correo : ${pedido.email} `,{
                width:420,
                align:'left',
                
            })
            doc.text(`Pais : ${pedido.pais}`,{
                width:420,
                align:'left',
                
            })
            doc.text(`Direccion de envio : ${pedido.estado}, ${pedido.ciudad}, ${pedido.line1}`,{
                width:420,
                align:'left',
                
            })
            doc.text(`Codigo Postal : ${pedido.postal_code}`,{
                width:420,
                align:'left',
                
            })
            doc.text(`n° Telf : ${pedido.phone}`,{
                width:420,
                align:'left',
                
            })
            doc.fill('#0000CD')
            .fontSize(15)
            doc.text(`Productos:`,{
                width:420,
                align:'center',
                
            })
        })

        doc.addTable(
            [
                {key: 'titulo', label: 'Nombre producto', align: 'left'},
                {key: 'precio', label: 'Precio', align: 'left'},
                {key: 'marca', label: 'Marca', align: 'left'},
                {key: 'cantidad', label: 'Cantidad',align: 'left'},
    
            ],
            productos, {
                border: null,
                width: "fill_body",
                striped: true,
                stripedColors: ["#f6f6f6", "#b8e2f4"],
                cellsPadding: 10,
                marginLeft: 45,
                marginRight: 45,
                headAlign: 'left'
            });
            // set the footer to render in every page
            doc.setDocumentFooter({

            }, () => {

                doc.fill("#0000CD")
                    .fontSize(15)
                    .text(`Total : ${total} $`, doc.footer.x*45, doc.footer.y-100);
            });

        doc.render()
        doc.end();
        
    } catch (error) {
        console.log(error)
        
    }
}
const generarExcel = (data,res, nameFile = '')=>{
    const workbook = new excel.Workbook();

    
    const worksheet = workbook.addWorksheet('Hoja 1');

    // Agregar los encabezados de columna
    let column = 1;
    // Establecer el estilo para el título
    const titleStyle = workbook.createStyle({
    font: {
        bold: true,
        size: 12,
    },
    alignment: {
        horizontal: 'center',
    },
    });
    for (let key in data[0]) {
        worksheet.cell(1, column).string(key).style(titleStyle);
        worksheet.column(column).setWidth(16);
        column++;
    }

    column = 2;
    // Agregar los valores en las celdas correspondientes
    for(let d of data){
        let row = 1;
        for (let key in d) {
            worksheet.cell(column,row ).string(d[key].toString());

            row++;
        }
        column++
    }
    workbook.write(`${nameFile}.xlsx`,res);
}

const readExcelFile = (file)=>{
    // Leer el archivo Excel
    const workbook = XLSX.readFile(file);
 
    // Obtener el nombre de la primera hoja
    const sheetName = workbook.SheetNames[0];

    // Obtener los datos de la hoja en formato JSON
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    return sheetData
}

const formatearPedido = (usuario) =>{
    return usuario.pedidos.map(pedido => {
        const totalCompra = pedido.productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        const productos = pedido.productos.map(producto => ({
            titulo: producto.titulo,
            precio: producto.precio,
            cantidad: producto.cantidad
          }));
        const fechaCompra = new Date(pedido.createdAt);
        const mesCompra = fechaCompra.toLocaleString('default', { month: 'long' });
        return {
          nombre_usuario: pedido.nombre,
          apellido_usuario: pedido.apellido,
          email: usuario.email,
          nombre_comprador: usuario.nombre,
          apellido_comprador: usuario.apellido,
          pais: pedido.pais,
          estado: pedido.estado,
          ciudad: pedido.ciudad,
          postal_code: pedido.postal_code,
          phone: pedido.phone,
          productos: JSON.stringify(productos),
          total:totalCompra+"$",
          mes: mesCompra
        };
      });
}
module.exports ={
    generarFactura,
    generarExcel,
    readExcelFile,
    formatearPedido
}