// This file was automatically generated from Parrilla.soy.
// Please don't edit this file by hand.

goog.provide('openmultimedia.componentes.programacion.ParrillaTemplates');

goog.require('soy');
goog.require('soy.StringBuilder');
goog.require('goog.i18n.bidi');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.programacion.ParrillaTemplates.contenedor = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="openmultimedia-componentes-parrilla-contenedor">');
  openmultimedia.componentes.programacion.ParrillaTemplates.tablaSemana(opt_data, output);
  openmultimedia.componentes.programacion.ParrillaTemplates.tablaProgramacionEncabezados(opt_data, output);
  output.append('<div class="openmultimedia-componentes-parrilla-programacion-contenedor"></div></div>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.programacion.ParrillaTemplates.tablaSemana = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<table class="openmultimedia-componentes-parrilla-semana"><tr class="openmultimedia-componentes-parrilla-semana-fila">');
  var diaList120 = opt_data.dias;
  var diaListLen120 = diaList120.length;
  for (var diaIndex120 = 0; diaIndex120 < diaListLen120; diaIndex120++) {
    var diaData120 = diaList120[diaIndex120];
    output.append((diaIndex120 == 0) ? '<td class="openmultimedia-componentes-parrilla-semana-separador-inicial"></td>' : '', (! (diaIndex120 == 0)) ? '<td class="openmultimedia-componentes-parrilla-semana-separador"></td>' : '', '<td class="openmultimedia-componentes-parrilla-semana-dia">', soy.$$escapeHtml(opt_data.localizacion['dias'][diaData120]), '</td>', (diaIndex120 == diaListLen120 - 1) ? '<td class="openmultimedia-componentes-parrilla-semana-separador-final"></td>' : '');
  }
  output.append('</tr></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.programacion.ParrillaTemplates.tablaProgramacionEncabezados = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<table class="openmultimedia-componentes-parrilla-programacion openmultimedia-componentes-parrilla-programacion-header"><thead class="openmultimedia-componentes-parrilla-header"><tr><td class="openmultimedia-componentes-parrilla-item-separador-inicial"></td><td class="openmultimedia-componentes-parrilla-item-horario">', soy.$$escapeHtml(opt_data.localizacion['encabezados']['horario']), '</td><td class="openmultimedia-componentes-parrilla-item-separador"></td><td class="openmultimedia-componentes-parrilla-item-programa">', soy.$$escapeHtml(opt_data.localizacion['encabezados']['programa']), '</td><td class="openmultimedia-componentes-parrilla-item-separador"></td><td class="openmultimedia-componentes-parrilla-item-descripcion">', soy.$$escapeHtml(opt_data.localizacion['encabezados']['descripcion']), '</td><td class="openmultimedia-componentes-parrilla-item-separador-final"></td></tr></thead></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
openmultimedia.componentes.programacion.ParrillaTemplates.tablaProgramacion = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="openmultimedia-componentes-parrilla-programacion-contenedor"><table class="openmultimedia-componentes-parrilla-programacion openmultimedia-componentes-parrilla-programacion-contenido"><tbody class="openmultimedia-componentes-parrilla-body">');
  var dataUnitList179 = opt_data.programacion;
  var dataUnitListLen179 = dataUnitList179.length;
  for (var dataUnitIndex179 = 0; dataUnitIndex179 < dataUnitListLen179; dataUnitIndex179++) {
    var dataUnitData179 = dataUnitList179[dataUnitIndex179];
    output.append('<tr class="openmultimedia-componentes-parrilla-tabla-fila ', (dataUnitIndex179 % 2 == 0) ? 'openmultimedia-componentes-parrilla-tabla-fila-par' : 'openmultimedia-componentes-parrilla-tabla-fila-non', ' ');
    switch (dataUnitData179.emision.estado) {
      case 'en-vivo':
        output.append('openmultimedia-componentes-parrilla-item-en-vivo');
        break;
      case 'grabado':
        output.append('openmultimedia-componentes-parrilla-item-grabado');
        break;
      case 'programado':
        output.append('openmultimedia-componentes-parrilla-item-programado');
        break;
    }
    output.append('"><td class="openmultimedia-componentes-parrilla-item-separador-inicial"></td><td class="openmultimedia-componentes-parrilla-item-horario">', (dataUnitData179.emision.estado == 'en-vivo') ? '<div class="openmultimedia-componentes-parrilla-item-estado-transmision"><a class="openmultimedia-componentes-parrilla-item-estado-transmision-link" href="' + soy.$$escapeHtml(dataUnitData179.emision.url ? dataUnitData179.emision.url : '') + '" target="_parent">' + soy.$$escapeHtml(opt_data.localizacion['estado-transmision'][dataUnitData179.emision.estado]) + '</a></div>' : '', '<span class="openmultimedia-componentes-parrilla-item-horario-principal"><span class="openmultimedia-componentes-parrilla-item-horario-pais">', soy.$$escapeHtml(opt_data.localizacion['regiones'][opt_data.pais]['nombre']), '</span><span class="openmultimedia-componentes-parrilla-item-horario-hora">', soy.$$escapeHtml(dataUnitData179.hora[opt_data.pais].inicio), (opt_data.mostrarHoraFinal != 'ninguno') ? ' - ' + soy.$$escapeHtml(dataUnitData179.hora[opt_data.pais].fin) : '', '</span></span>');
    var regionList225 = opt_data.regiones;
    var regionListLen225 = regionList225.length;
    for (var regionIndex225 = 0; regionIndex225 < regionListLen225; regionIndex225++) {
      var regionData225 = regionList225[regionIndex225];
      output.append('<span class="openmultimedia-componentes-parrilla-item-horario-otro ', (regionIndex225 % 2 == 0) ? ' openmultimedia-componentes-parrilla-item-horario-otro-par ' : ' openmultimedia-componentes-parrilla-item-horario-otro-non ', '"><span class="openmultimedia-componentes-parrilla-item-horario-pais">[', soy.$$escapeHtml(opt_data.localizacion['regiones'][regionData225]['abreviatura']), ']</span> <span class="openmultimedia-componentes-parrilla-item-horario-hora">', soy.$$escapeHtml(dataUnitData179.hora[regionData225].inicio), (opt_data.mostrarHoraFinal == 'todos') ? ' - ' + soy.$$escapeHtml(dataUnitData179.hora[regionData225].fin) : '', '</span></span>');
    }
    output.append('</td><td class="openmultimedia-componentes-parrilla-item-separador"></td><td class="openmultimedia-componentes-parrilla-item-programa">', (dataUnitData179.programa.imagen_url) ? '<p>' + soy.$$escapeHtml(dataUnitData179.programa.nombre) + '</p><img class="openmultimedia-componentes-parrilla-item-programa-logo" src="' + soy.$$escapeHtml(dataUnitData179.programa.imagen_url) + '" alt="' + soy.$$escapeHtml(dataUnitData179.programa.nombre) + '"/>' : '<p>' + dataUnitData179.programa.nombre + '</p>', '</td><td class="openmultimedia-componentes-parrilla-item-separador"></td><td class="openmultimedia-componentes-parrilla-item-descripcion">', soy.$$truncate(soy.$$escapeHtml(dataUnitData179.programa.descripcion), 240, true), '</td><td class="openmultimedia-componentes-parrilla-item-separador-final"></td></tr>');
  }
  output.append('</tbody></table></div>');
  return opt_sb ? '' : output.toString();
};
