import tempfile
import pathlib
import pytest

from backend.app.data_loader import get_shared_movie_ids, load_data, pearson_correlation


def test_load_data_success():
    with tempfile.TemporaryDirectory() as td:
        tdpath = pathlib.Path(td)
        # crear u.data con tres valoraciones
        udata = """
1	10	4	1234567890
2	10	5	1234567891
1	20	3	1234567892
""".strip()
        # u.item: id|title (otros campos ignorados)
        uitem = """
10|Movie A
20|Movie B
""".strip()
        (tdpath / 'u.data').write_text(udata, encoding='utf-8')
        (tdpath / 'u.item').write_text(uitem, encoding='latin-1')

        ratings, items = load_data(data_dir=str(tdpath))

        assert 1 in ratings
        assert 2 in ratings
        assert ratings[1][10] == 4.0
        assert ratings[2][10] == 5.0
        assert ratings[1][20] == 3.0
        assert items[10]['title'] == 'Movie A'
        assert items[20]['title'] == 'Movie B'

        shared = get_shared_movie_ids(1, 2, ratings)
        assert shared == {10}


def test_shared_movie_ids_returns_empty_when_no_overlap():
    ratings = {
        1: {10: 4.0, 20: 3.0},
        2: {30: 5.0}
    }
    shared = get_shared_movie_ids(1, 2, ratings)
    assert shared == set()


def test_pearson_correlation_perfect_positive():
    ratings = {
        1: {10: 4.0, 20: 3.0, 30: 5.0},
        2: {10: 5.0, 20: 4.0, 30: 6.0}
    }
    similarity = pearson_correlation(1, 2, ratings)
    assert similarity == pytest.approx(1.0, abs=1e-9)


def test_pearson_correlation_no_overlap_returns_zero():
    ratings = {
        1: {10: 4.0, 20: 3.0},
        2: {30: 5.0, 40: 2.0}
    }
    similarity = pearson_correlation(1, 2, ratings)
    assert similarity == 0.0


def test_pearson_correlation_constant_ratings_returns_zero():
    ratings = {
        1: {10: 3.0, 20: 3.0},
        2: {10: 4.0, 20: 4.0}
    }
    similarity = pearson_correlation(1, 2, ratings)
    assert similarity == 0.0


def test_load_data_missing_udata_raises():
    with tempfile.TemporaryDirectory() as td:
        tdpath = pathlib.Path(td)
        # solo u.item presente
        (tdpath / 'u.item').write_text('10|Movie A', encoding='latin-1')
        with pytest.raises(FileNotFoundError):
            load_data(data_dir=str(tdpath))
