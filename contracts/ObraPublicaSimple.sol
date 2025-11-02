// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ObraPublicaRegistry - Versión Simplificada
 * @dev Contrato simplificado para pruebas de despliegue en LACNET
 */
contract ObraPublicaRegistry {

    struct Obra {
        uint256 id;
        string datos;
        address reportadoPor;
        bool activo;
    }

    mapping(uint256 => Obra) public obras;
    uint256 public totalObras;

    event ObraRegistrada(uint256 indexed id, address indexed reportadoPor);

    function registrarObra(string memory _datos) public returns (uint256) {
        totalObras++;
        obras[totalObras] = Obra({
            id: totalObras,
            datos: _datos,
            reportadoPor: msg.sender,
            activo: true
        });

        emit ObraRegistrada(totalObras, msg.sender);
        return totalObras;
    }
}
