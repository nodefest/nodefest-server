var io = require( 'socket.io' ).listen( process.env.PORT || 80 );

io.sockets.on( 'connection', function ( socket ) {

  socket.on( 'server_fire', function ( data ) {

    socket.broadcast.emit( 'client_fire', data );

  } );

} );
