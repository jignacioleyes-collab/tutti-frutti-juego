const DICTIONARY = {
  'Nombre': {
    'A': ['Agustín', 'Ana', 'Alejandro', 'Andrea', 'Alberto', 'Alicia', 'Ariel', 'Adriana', 'Andrés', 'Antonella', 'Aníbal', 'Ángel', 'Amalia', 'Alfonso'],
    'B': ['Bruno', 'Bautista', 'Belén', 'Brenda', 'Bárbara', 'Bernardo', 'Bianca', 'Benjamín', 'Beatriz', 'Benicio', 'Beto', 'Borja'],
    'C': ['Carlos', 'Carolina', 'Cristian', 'Camila', 'Claudio', 'Cecilia', 'César', 'Cintia', 'Catalina', 'Constanza', 'Ciro', 'Candelaria'],
    'D': ['Daniel', 'Diana', 'Diego', 'Daniela', 'David', 'Débora', 'Darío', 'Delfina', 'Domingo', 'Dolores', 'Damián', 'Dante'],
    'E': ['Eduardo', 'Elena', 'Esteban', 'Eliana', 'Emiliano', 'Estela', 'Ezequiel', 'Eugenia', 'Emilio', 'Elsa', 'Enrique', 'Eva'],
    'F': ['Facundo', 'Florencia', 'Federico', 'Fabiola', 'Fernando', 'Fátima', 'Fabián', 'Fiorella', 'Felipe', 'Franco', 'Francisco', 'Fausto'],
    'G': ['Gabriel', 'Gabriela', 'Gastón', 'Gisela', 'Guillermo', 'Graciela', 'Gonzalo', 'Guadalupe', 'Germán', 'Gisella', 'Guido', 'Gianna'],
    'H': ['Hugo', 'Helena', 'Horacio', 'Hilda', 'Hernán', 'Héctor', 'Humberto', 'Heitor', 'Hans', 'Hellen', 'Hesper'],
    'I': ['Ignacio', 'Inés', 'Iván', 'Irene', 'Ismael', 'Isabel', 'Ian', 'Iara', 'Irma', 'Isabella', 'Iker'],
    'J': ['Juan', 'Julia', 'Joaquín', 'Julieta', 'Javier', 'Josefina', 'Jorge', 'Jesica', 'José', 'Jimena', 'Julio', 'Jaime'],
    'K': ['Kevin', 'Karina', 'Kioshi', 'Karen', 'Katia', 'Klaus', 'Kenji'],
    'L': ['Lucas', 'Laura', 'Leonardo', 'Lucía', 'Leandro', 'Lorena', 'Luis', 'Luz', 'Lautaro', 'Lisandro', 'Lourdes', 'Lorenzo'],
    'M': ['Martín', 'María', 'Matías', 'Mariana', 'Marcos', 'Micaela', 'Marcelo', 'Malena', 'Mateo', 'Mia', 'Manuel', 'Milagros'],
    'N': ['Nicolás', 'Natalia', 'Nahuel', 'Nadia', 'Néstor', 'Noelia', 'Norberto', 'Nora', 'Nicanor', 'Noemí', 'Noah', 'Nerea'],
    'O': ['Omar', 'Olivia', 'Oscar', 'Ofelia', 'Osvaldo', 'Oriana', 'Otto', 'Octavio', 'Ornella'],
    'P': ['Pablo', 'Paula', 'Pedro', 'Patricia', 'Patricio', 'Pamela', 'Pilar', 'Paloma', 'Priscila', 'Pascual'],
    'R': ['Roberto', 'Romina', 'Rodrigo', 'Rocío', 'Ricardo', 'Rosario', 'Raúl', 'Renata', 'Ramiro', 'Rafael', 'Rubén', 'Rebeca'],
    'S': ['Santiago', 'Sofía', 'Sebastián', 'Silvia', 'Sergio', 'Sol', 'Simón', 'Sabrina', 'Santino', 'Silvana', 'Salvador', 'Stella'],
    'T': ['Tomás', 'Tatiana', 'Thiago', 'Teresa', 'Tobías', 'Tamara', 'Trinidad', 'Teo', 'Teodoro', 'Tadeo'],
    'U': ['Ulises', 'Úrsula', 'Uriel', 'Urbano', 'Umar'],
    'V': ['Víctor', 'Victoria', 'Valentín', 'Valeria', 'Vicente', 'Verónica', 'Valentina', 'Violeta', 'Virginia', 'Vanesa']
  },
  'Color': {
    'A': ['Amarillo', 'Azul', 'Añil', 'Ámbar', 'Aguamarina', 'Almendra', 'Azul marino', 'Azul cielo', 'Azul claro', 'Azul oscuro'],
    'B': ['Blanco', 'Bordo', 'Beige', 'Bronce', 'Bermellón', 'Bígaro', 'Blanco hueso', 'Bordó'],
    'C': ['Celeste', 'Cian', 'Carmín', 'Castaño', 'Coral', 'Cobre', 'Chocolate', 'Crema', 'Cian oscuro'],
    'D': ['Dorado', 'Durazno', 'Damasco'],
    'E': ['Esmeralda', 'Escarlata', 'Esmeralda claro'],
    'F': ['Fucsia', 'Frambuesa'],
    'G': ['Gris', 'Granate', 'Gualdo', 'Gris claro', 'Gris oscuro'],
    'H': ['Hueso', 'Herrumbre'],
    'I': ['Índigo', 'Iris'],
    'J': ['Jade', 'Jazmín'],
    'K': ['Kaki', 'Kiwi'],
    'L': ['Lila', 'Lima', 'Limón', 'Lavanda', 'Ladrillo'],
    'M': ['Marrón', 'Morado', 'Magenta', 'Mostaza', 'Marfil', 'Mandarina', 'Marrón claro', 'Marrón oscuro'],
    'N': ['Negro', 'Naranja', 'Nácar', 'Nieve'],
    'O': ['Oro', 'Ocres', 'Oliva', 'Ocre', 'Oscuro'],
    'P': ['Plata', 'Púrpura', 'Plomizo', 'Pistacho', 'Pardo', 'Pino', 'Piel'],
    'R': ['Rojo', 'Rosa', 'Rubí', 'Rosado', 'Rojo oscuro', 'Rojo claro'],
    'S': ['Salmón', 'Sepia', 'Siena', 'Siena tostada'],
    'T': ['Turquesa', 'Tomate', 'Tostado', 'Trigo', 'Turquesa claro'],
    'U': ['Uva', 'Ultramar'],
    'V': ['Verde', 'Violeta', 'Vainilla', 'Vino', 'Verde agua', 'Verde claro', 'Verde oscuro', 'Verde lima']
  },
  'Cosa': {
    'A': ['Auto', 'Armario', 'Anteojos', 'Aro', 'Anillo', 'Aguja', 'Almohada', 'Alfombra', 'Abanico', 'Adorno', 'Avión', 'Ancla'],
    'B': ['Bote', 'Botella', 'Bolso', 'Balanza', 'Botón', 'Borrador', 'Bandera', 'Banco', 'Balde', 'Bolsa', 'Bicicleta', 'Batería'],
    'C': ['Cama', 'Casa', 'Cuadro', 'Cuchillo', 'Cuchara', 'Computadora', 'Celular', 'Caja', 'Cajón', 'Campera', 'Cinturón', 'Candado'],
    'D': ['Dado', 'Dedo', 'Disco', 'Diario', 'Ducha', 'Diente', 'Diamante', 'Dardo', 'Delantal', 'Dispositivo'],
    'E': ['Escoba', 'Espejo', 'Escalera', 'Estufa', 'Escritorio', 'Espada', 'Estatua', 'Embudo', 'Esponja', 'Estuche', 'Escaparate'],
    'F': ['Faro', 'Florero', 'Fósforo', 'Foco', 'Flecha', 'Freno', 'Frasco', 'Flauta', 'Filtro', 'Ficha', 'Funda'],
    'G': ['Goma', 'Gorro', 'Guitarra', 'Gota', 'Guante', 'Gafas', 'Gancho', 'Grifo', 'Gabinete', 'Gorra', 'Garrafa'],
    'H': ['Hilo', 'Heladera', 'Horno', 'Hacha', 'Hoja', 'Hueso', 'Hamaca', 'Hélice', 'Herramienta', 'Hielera'],
    'I': ['Imán', 'Isla', 'Iglesia', 'Inodoro', 'Instrumento', 'Inyector', 'Impresora'],
    'J': ['Jarro', 'Jarra', 'Juguete', 'Joyero', 'Jeringa', 'Jaula', 'Jabón', 'Jarrón'],
    'K': ['Kiosco', 'Kayak', 'Kilo', 'Karton'],
    'L': ['Libro', 'Lápiz', 'Lámpara', 'Lata', 'Llave', 'Lente', 'Ladrillo', 'Linterna', 'Lona', 'Lavarropas', 'Lenteja'],
    'M': ['Mesa', 'Mochila', 'Mate', 'Moneda', 'Mapa', 'Muñeca', 'Martillo', 'Manta', 'Manguera', 'Mueble', 'Maleta', 'Maceta'],
    'N': ['Nave', 'Nube', 'Nudo', 'Navaja', 'Neumático', 'Nido', 'Notebook'],
    'O': ['Olla', 'Ojo', 'Oreja', 'Oro', 'Obelisco', 'Ombú', 'Oso de peluche', 'Organizador'],
    'P': ['Puerta', 'Pantalón', 'Pelota', 'Pincel', 'Plato', 'Peine', 'Pala', 'Piano', 'Pared', 'Pluma', 'Papel', 'Perchero'],
    'R': ['Reloj', 'Radio', 'Rueda', 'Regla', 'Ropa', 'Revista', 'Remo', 'Raqueta', 'Ropero', 'Rallador', 'Radiador'],
    'S': ['Silla', 'Sillón', 'Sombrero', 'Sábana', 'Sartén', 'Secador', 'Semáforo', 'Serrucho', 'Sobre', 'Sello', 'Soga'],
    'T': ['Tenedor', 'Televisor', 'Taza', 'Tijera', 'Teléfono', 'Tambor', 'Toalla', 'Tornillo', 'Tapa', 'Tarjeta', 'Teclado', 'Taza'],
    'U': ['Uña', 'Uniforme', 'Urna', 'Ukelele', 'Unicornio', 'Utensilio'],
    'V': ['Vaso', 'Ventana', 'Vela', 'Violín', 'Vestido', 'Volante', 'Vagón', 'Ventilador', 'Valija', 'Vaso', 'Vidrio']
  },
  'Comida': {
    'A': ['Asado', 'Alfajor', 'Arroz', 'Avena', 'Atún', 'Aceituna', 'Ananá', 'Almendra', 'Avellana', 'Ajo', 'Acelga', 'Alcaucil'],
    'B': ['Banana', 'Bife', 'Bondiola', 'Buñuelo', 'Bizcocho', 'Berenjena', 'Brócoli', 'Batata', 'Bizcochuelo', 'Bocado', 'Bacalau'],
    'C': ['Carne', 'Choripán', 'Churro', 'Chocolate', 'Cebolla', 'Cereza', 'Ciruela', 'Canelón', 'Choclo', 'Castaña', 'Coco', 'Caldo'],
    'D': ['Dulce de leche', 'Durazno', 'Dona', 'Doritos', 'Dulce de membrillo', 'Damasco', 'Dulce de batata', 'Datil'],
    'E': ['Empanada', 'Ensalada', 'Espagueti', 'Espinaca', 'Estofado', 'Espárrago', 'Ensalada rusa', 'Empanadillas'],
    'F': ['Fideo', 'Frutilla', 'Flan', 'Fiambre', 'Factura', 'Fainá', 'Frambuesa', 'Fideos', 'Fritas', 'Fruta'],
    'G': ['Galletita', 'Guiso', 'Gelatina', 'Garbanzo', 'Grasa', 'Gomita', 'Granada', 'Galleta', 'Guiso de lentejas'],
    'H': ['Hamburguesa', 'Helado', 'Huevo', 'Higo', 'Harina', 'Humita', 'Huevo frito', 'Hojaldre'],
    'I': ['Iogur', 'Isomalt', 'Iceberg'],
    'J': ['Jamón', 'Jugo', 'Jengibre', 'Jalea', 'Jalapeño', 'Jamón cocido', 'Jamón crudo'],
    'K': ['Kiwi', 'Ketchup', 'Kebab', 'Kirsch'],
    'L': ['Leche', 'Lechuga', 'Lenteja', 'Limón', 'Locro', 'Lomo', 'Langostino', 'Lasaña', 'Lentejas', 'Lima'],
    'M': ['Manzana', 'Mandarina', 'Milanesa', 'Menta', 'Miel', 'Maní', 'Manteca', 'Melón', 'Morrón', 'Mozzarella', 'Mousse'],
    'N': ['Naranja', 'Nuez', 'Ñoqui', 'Nabo', 'Nectarina', 'Natilla', 'Nuggets'],
    'O': ['Omelette', 'Ostiones', 'Orégano', 'Osobuco', 'Oliva', 'Ostra'],
    'P': ['Pan', 'Polenta', 'Pescado', 'Papa', 'Pastel', 'Pizza', 'Pollo', 'Pera', 'Papas fritas', 'Pancho', 'Puré', 'Pimienta'],
    'R': ['Queso', 'Ravioles', 'Repollo', 'Ricota', 'Rabanito', 'Rosca', 'Remolacha', 'Ravioles', 'Risotoc'],
    'S': ['Salame', 'Sandía', 'Sopa', 'Salchicha', 'Salsa', 'Sushi', 'Sorrentino', 'Sándwich', 'Sopaipilla'],
    'T': ['Tomate', 'Torta', 'Tarta', 'Tostada', 'Trufa', 'Taco', 'Tallarines', 'Tarta de manzana', 'Tortilla'],
    'U': ['Uva', 'Uvita', 'Uvas'],
    'V': ['Vainilla', 'Verdura', 'Vino', 'Vinagre', 'Vitel toné', 'Vaca', 'Waffle']
  },
  'Animal': {
    'A': ['Araña', 'Águila', 'Abeja', 'Alce', 'Anaconda', 'Avestruz', 'Armadillo', 'Alpaca', 'Avispa', 'Ardilla', 'Asno', 'Anguila'],
    'B': ['Ballena', 'Búho', 'Buitre', 'Burro', 'Búfalo', 'Babuino', 'Boa', 'Becerro', 'Babuino', 'Bisonte'],
    'C': ['Caballo', 'Perro', 'Conejo', 'Cocodrilo', 'Cebra', 'Cangrejo', 'Castor', 'Canguro', 'Camello', 'Cabra', 'Ciervo', 'Cisne'],
    'D': ['Delfín', 'Dinosaurio', 'Dromedario', 'Dragón de Komodo', 'Dingo', 'Donkey'],
    'E': ['Elefante', 'Escarabajo', 'Escorpión', 'Estrella de mar', 'Erizo', 'Emu', 'Escarabajo', 'Erizo de mar'],
    'F': ['Foca', 'Flamenco', 'Faisán', 'Fossa', 'Frailecillo'],
    'G': ['Gato', 'Gallo', 'Gaviota', 'Gorila', 'Gusano', 'Garrapata', 'Guepardo', 'Guanaco', 'Gallina', 'Gaza', 'Gacela'],
    'H': ['Hormiga', 'Halcón', 'Hipopótamo', 'Hiena', 'Hurón', 'Hámster', 'Hipocampo'],
    'I': ['Iguana', 'Impala', 'Insecto', 'Íbice'],
    'J': ['Jirafa', 'Jaguar', 'Jabalí', 'Jilguero'],
    'K': ['Koala', 'Kiwi'],
    'L': ['León', 'Loro', 'Liebre', 'Lobo', 'Lagarto', 'Leopardo', 'Lombriz', 'Llama', 'Luciérnaga', 'Lémur', 'Langosta'],
    'M': ['Mono', 'Mosca', 'Mariposa', 'Murciélago', 'Medusa', 'Marmota', 'Morsa', 'Mapache', 'Mosquito', 'Mula', 'Mantis'],
    'N': ['Nutria', 'Narval', 'Ñandú', 'NUTRIA'],
    'O': ['Oso', 'Oveja', 'Oruga', 'Ostra', 'Orangután', 'Oca', 'Ornitorrinco', 'Oso polar', 'Oso pardo'],
    'P': ['Perro', 'Pato', 'Pájaro', 'Pez', 'Pulpo', 'Pingüino', 'Pantera', 'Puma', 'Paloma', 'Pelícano', 'Pavo', 'Piraña'],
    'R': ['Ratón', 'Rana', 'Rinoceronte', 'Rata', 'Ruiseñor', 'Reno', 'Raya', 'Reno'],
    'S': ['Sapo', 'Serpiente', 'Saltamontes', 'Sardina', 'Salamandra', 'Suricata', 'Salmón', 'Salamandra'],
    'T': ['Tigre', 'Tortuga', 'Toro', 'Tiburón', 'Tucán', 'Topo', 'Tapir', 'Tarántula', 'Ternero', 'Trucha'],
    'U': ['Urraca', 'Unicornio'],
    'V': ['Vaca', 'Venado', 'Víbora', 'Vicuña', 'Visón', 'Vencejo', 'Vicuña']
  },
  'Pais': {
    'A': ['Argentina', 'Alemania', 'Australia', 'Argelia', 'Angola', 'Austria', 'Afganistán', 'Albania', 'Andorra', 'Armenia'],
    'B': ['Brasil', 'Bélgica', 'Bolivia', 'Bulgaria', 'Bahamas', 'Bangladés', 'Barbados', 'Belice', 'Benín', 'Bielorrusia'],
    'C': ['Canadá', 'Chile', 'Colombia', 'Cuba', 'Costa Rica', 'China', 'Croacia', 'Camboya', 'Camerún', 'Chipre'],
    'D': ['Dinamarca', 'Dominica', 'Dominicana'],
    'E': ['Ecuador', 'Egipto', 'España', 'Estados Unidos', 'Etiopía', 'El Salvador', 'Eslovaquia', 'Eslovenia', 'Estonia'],
    'F': ['Francia', 'Finlandia', 'Filipinas', 'Fiyi'],
    'G': ['Grecia', 'Guatemala', 'Ghana', 'Granada', 'Georgia', 'Guinea'],
    'H': ['Honduras', 'Haití', 'Hungría', 'Holanda'],
    'I': ['Italia', 'India', 'Indonesia', 'Irlanda', 'Israel', 'Irak', 'Irán', 'Islandia'],
    'J': ['Japón', 'Jamaica', 'Jordania'],
    'K': ['Kenia', 'Kuwait', 'Kazajistán', 'Kirguistán'],
    'L': ['Luxemburgo', 'Líbano', 'Laos', 'Letonia', 'Liberia', 'Libia', 'Lituania'],
    'M': ['México', 'Marruecos', 'Mónaco', 'Mozambique', 'Malasia', 'Maldivas', 'Malta', 'Mongolia'],
    'N': ['Nigeria', 'Nicaragua', 'Noruega', 'Nueva Zelanda', 'Nepal', 'Níger'],
    'O': ['Omán'],
    'P': ['Panamá', 'Perú', 'Paraguay', 'Portugal', 'Polonia', 'Pakistán', 'Países Bajos'],
    'Q': ['Qatar'],
    'R': ['Rusia', 'Rumania', 'Reino Unido', 'República Checa', 'Ruanda'],
    'S': ['Senegal', 'Suiza', 'Suecia', 'Siria', 'Sudáfrica', 'Serbia', 'Somalia', 'Sri Lanka', 'Sudán'],
    'T': ['Tailandia', 'Túnez', 'Turquía', 'Tanzania', 'Togo', 'Trinidad y Tobago'],
    'U': ['Uruguay', 'Ucrania', 'Uganda', 'Uzbekistán'],
    'V': ['Venezuela', 'Vietnam', 'Vaticano']
  }
};

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Validates whether a word is valid for a category and starting letter.
 * Checks dictionary for known categories, with fuzzy matching support for typos.
 */
function isValidCategoryWord(text, category, letter) {
  if (!text || !letter) return false;
  
  const normText = normalizeText(text);
  const upperLetter = letter.toUpperCase();
  const lowerLetter = letter.toLowerCase();

  // Rule 1: Length must be at least 2 characters (no single letters like "f", "h", "a")
  if (normText.length < 2) return false;

  // Rule 2: Must start with the required letter
  if (!normText.startsWith(lowerLetter)) return false;

  // Find category key in DICTIONARY
  let catKey = null;
  const normCat = normalizeText(category).replace(/s$/, ''); // e.g. "nombres" -> "nombre", "paises" -> "pais"
  
  for (const key of Object.keys(DICTIONARY)) {
    const normKey = normalizeText(key).replace(/s$/, '');
    if (normKey === normCat || normKey.includes(normCat) || normCat.includes(normKey)) {
      catKey = key;
      break;
    }
  }

  // If the category is found in our DICTIONARY
  if (catKey && DICTIONARY[catKey] && DICTIONARY[catKey][upperLetter]) {
    const list = DICTIONARY[catKey][upperLetter];
    
    // 1. Direct exact match
    for (const w of list) {
      if (normalizeText(w) === normText) return true;
    }
    
    // 2. Starts with / prefix match for compound words (e.g. "Azul marino", "Dulce de leche")
    for (const w of list) {
      const normW = normalizeText(w);
      if (normText.startsWith(normW) || normW.startsWith(normText)) {
        if (Math.abs(normW.length - normText.length) <= 3) return true;
      }
    }

    // 3. Fuzzy match for typos (e.g. "seleste" vs "celeste", "hector" vs "hector")
    for (const w of list) {
      const normW = normalizeText(w);
      const dist = levenshteinDistance(normText, normW);
      const maxDist = normText.length >= 6 ? 2 : 1;
      if (dist <= maxDist) return true;
    }

    // If it's in a known category dictionary but didn't match any known word or fuzzy typo: INVALID!
    return false;
  }

  // Fallback for custom categories NOT in DICTIONARY (e.g. "SUPERHÉROE", "PELÍCULA"):
  // Basic linguistic sanity check: must contain at least 1 vowel, no 4 consecutive consonants, no repetitive single char like "aaaaa"
  const hasVowels = /[aeiouy]/.test(normText);
  const noGibberishConsonants = !/[bcdfghjklmnpqrstvwxyz]{4,}/.test(normText);
  const noRepeatedChars = !/(.)\1\1/.test(normText);

  return hasVowels && noGibberishConsonants && noRepeatedChars;
}

function findSuggestions(text, category, letter, maxDistance = 2) {
  if (!text || !category || !letter) return [];
  
  const normText = normalizeText(text);
  const upperLetter = letter.toUpperCase();
  
  if (!DICTIONARY[category] || !DICTIONARY[category][upperLetter]) {
    return [];
  }
  
  const words = DICTIONARY[category][upperLetter];
  const results = [];
  
  for (const word of words) {
    const normWord = normalizeText(word);
    
    if (normWord.startsWith(normText)) {
      results.push({ word, distance: 0 });
      continue;
    }
    
    const distance = levenshteinDistance(normText, normWord);
    if (distance <= maxDistance) {
      results.push({ word, distance });
    }
  }
  
  return results.sort((a, b) => a.distance - b.distance);
}

// Export for use in Node.js or Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DICTIONARY, normalizeText, levenshteinDistance, findSuggestions, isValidCategoryWord };
} else {
  window.DICTIONARY = DICTIONARY;
  window.normalizeText = normalizeText;
  window.levenshteinDistance = levenshteinDistance;
  window.findSuggestions = findSuggestions;
  window.isValidCategoryWord = isValidCategoryWord;
}
