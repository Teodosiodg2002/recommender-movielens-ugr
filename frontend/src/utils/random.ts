import { Movie } from '../types/movie'

const MOVIES: Movie[] = [
  { id: 101, title: 'El club de la lucha', genre: 'Drama', year: '1999' },
  { id: 102, title: 'Matrix', genre: 'Ciencia ficción', year: '1999' },
  { id: 103, title: 'Memento', genre: 'Thriller', year: '2000' },
  { id: 104, title: 'Amélie', genre: 'Romance', year: '2001' },
  { id: 105, title: 'Gran Torino', genre: 'Drama', year: '2008' },
  { id: 106, title: 'Moonlight', genre: 'Drama', year: '2016' },
  { id: 107, title: 'Blade Runner', genre: 'Ciencia ficción', year: '1982' },
  { id: 108, title: 'La La Land', genre: 'Musical', year: '2016' },
  { id: 109, title: 'Her', genre: 'Romance', year: '2013' },
  { id: 110, title: 'El pianista', genre: 'Biografía', year: '2002' },
  { id: 111, title: 'Parásitos', genre: 'Thriller', year: '2019' },
  { id: 112, title: 'El gran hotel Budapest', genre: 'Comedia', year: '2014' },
  { id: 113, title: 'Ciudad de Dios', genre: 'Crimen', year: '2002' },
  { id: 114, title: 'Interestelar', genre: 'Ciencia ficción', year: '2014' },
  { id: 115, title: 'Mad Max: Furia en la carretera', genre: 'Acción', year: '2015' },
  { id: 116, title: 'Whiplash', genre: 'Drama', year: '2014' },
  { id: 117, title: 'La red social', genre: 'Drama', year: '2010' },
  { id: 118, title: 'Los juegos del hambre', genre: 'Aventura', year: '2012' },
  { id: 119, title: 'El laberinto del fauno', genre: 'Fantasía', year: '2006' },
  { id: 120, title: 'Toy Story', genre: 'Animación', year: '1995' },
  { id: 121, title: 'El señor de los anillos', genre: 'Fantasía', year: '2001' },
  { id: 122, title: 'La princesa prometida', genre: 'Aventura', year: '1987' },
  { id: 123, title: 'Un lugar tranquilo', genre: 'Terror', year: '2018' },
  { id: 124, title: 'El viaje de Chihiro', genre: 'Animación', year: '2001' },
  { id: 125, title: 'Inception', genre: 'Ciencia ficción', year: '2010' },
  { id: 126, title: 'La vida es bella', genre: 'Drama', year: '1997' },
  { id: 127, title: 'El caballero oscuro', genre: 'Acción', year: '2008' },
  { id: 128, title: 'Interstellar', genre: 'Ciencia ficción', year: '2014' },
  { id: 129, title: 'El bueno, el feo y el malo', genre: 'Western', year: '1966' },
  { id: 130, title: 'Jurassic Park', genre: 'Aventura', year: '1993' },
  { id: 131, title: 'Amores perros', genre: 'Drama', year: '2000' },
]

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export const getRandomMovies = (count: number): Movie[] => {
  return shuffle(MOVIES).slice(0, Math.min(count, MOVIES.length))
}
