import * as Extractor from './extractor/';
import Serie from './model/Serie.js'
import q from 'q'

const extractors = ['LegendasTV', 'OpenSubtitles'];

module.exports = (serie_id, callback) => {
  const ser = Serie.find({id: serie_id});
  return q.all(extractors.map(item => {
    return new Extractor[item]().extract(ser);
  }));
};
