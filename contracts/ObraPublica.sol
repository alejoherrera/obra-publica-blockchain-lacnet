// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ObraPublicaRegistry
 * @dev Almacena registros de obras públicas con evaluación de riesgos climáticos
 */
contract ObraPublicaRegistry {

    struct Obra {
        uint256 id;
        string datosJSON;           // JSON completo de la obra
        string ubicacion;            // Ubicación (ciudad, país)
        string tipoObra;            // Tipo de construcción
        uint256 timestamp;          // Fecha de registro
        address reportadoPor;       // Dirección que reportó
        bool activo;                // Estado de la obra
    }

    // Mapeo de ID a Obra
    mapping(uint256 => Obra) public obras;

    // Contador de obras
    uint256 public totalObras;

    // Eventos
    event ObraRegistrada(
        uint256 indexed id,
        string ubicacion,
        string tipoObra,
        uint256 timestamp,
        address indexed reportadoPor
    );

    event ObraActualizada(
        uint256 indexed id,
        string datosJSON,
        uint256 timestamp
    );

    event ObraDesactivada(
        uint256 indexed id,
        uint256 timestamp
    );

    /**
     * @dev Registra una nueva obra pública
     * @param _datosJSON JSON con toda la información de la obra
     * @param _ubicacion Ubicación de la obra
     * @param _tipoObra Tipo de construcción
     */
    function registrarObra(
        string memory _datosJSON,
        string memory _ubicacion,
        string memory _tipoObra
    ) public returns (uint256) {
        totalObras++;
        uint256 nuevoId = totalObras;

        obras[nuevoId] = Obra({
            id: nuevoId,
            datosJSON: _datosJSON,
            ubicacion: _ubicacion,
            tipoObra: _tipoObra,
            timestamp: block.timestamp,
            reportadoPor: msg.sender,
            activo: true
        });

        emit ObraRegistrada(
            nuevoId,
            _ubicacion,
            _tipoObra,
            block.timestamp,
            msg.sender
        );

        return nuevoId;
    }

    /**
     * @dev Actualiza los datos de una obra existente
     * @param _id ID de la obra
     * @param _datosJSON Nuevos datos en JSON
     */
    function actualizarObra(
        uint256 _id,
        string memory _datosJSON
    ) public {
        require(_id > 0 && _id <= totalObras, "Obra no existe");
        require(obras[_id].activo, "Obra no esta activa");

        obras[_id].datosJSON = _datosJSON;
        obras[_id].timestamp = block.timestamp;

        emit ObraActualizada(_id, _datosJSON, block.timestamp);
    }

    /**
     * @dev Desactiva una obra
     * @param _id ID de la obra
     */
    function desactivarObra(uint256 _id) public {
        require(_id > 0 && _id <= totalObras, "Obra no existe");
        require(obras[_id].activo, "Obra ya esta desactivada");

        obras[_id].activo = false;

        emit ObraDesactivada(_id, block.timestamp);
    }

    /**
     * @dev Obtiene los datos de una obra
     * @param _id ID de la obra
     */
    function obtenerObra(uint256 _id) public view returns (
        uint256 id,
        string memory datosJSON,
        string memory ubicacion,
        string memory tipoObra,
        uint256 timestamp,
        address reportadoPor,
        bool activo
    ) {
        require(_id > 0 && _id <= totalObras, "Obra no existe");
        Obra memory obra = obras[_id];

        return (
            obra.id,
            obra.datosJSON,
            obra.ubicacion,
            obra.tipoObra,
            obra.timestamp,
            obra.reportadoPor,
            obra.activo
        );
    }

    /**
     * @dev Obtiene el total de obras (reemplazo de obtenerObrasActivas simplificado)
     */
    function getTotalObras() public view returns (uint256) {
        return totalObras;
    }
}
