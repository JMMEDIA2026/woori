(function () {
  var panes = [1, 2, 3, 4].map(function (i) { return document.getElementById('pane' + i); });
  var stepEls = document.querySelectorAll('.steps li');
  var list = document.getElementById('numbers');
  var state = document.getElementById('state1');
  var chosen = '';

  function go(n) {
    panes.forEach(function (p, i) { p.hidden = (i + 1 !== n); });
    stepEls.forEach(function (li) {
      var s = Number(li.dataset.step);
      li.classList.toggle('on', s === Math.min(n, 3));
    });
    if (n === 3) {
      document.getElementById('sumNum').textContent = chosen;
      document.getElementById('sumAgent').textContent = document.querySelector('input[name=agent]:checked').value;
    }
  }

  function render(items) {
    list.textContent = '';
    items.forEach(function (it) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      var num = document.createElement('span'); num.className = 'num'; num.textContent = it.number;
      var city = document.createElement('span'); city.className = 'city';
      city.textContent = it.city + ' · ' + it.country + ' ' + it.area + ' · 예시';
      b.appendChild(num); b.appendChild(city);
      b.addEventListener('click', function () {
        chosen = it.number;
        document.getElementById('chosenNum').textContent = chosen;
        go(2);
      });
      li.appendChild(b); list.appendChild(li);
    });
  }

  function search() {
    var country = document.getElementById('country').value;
    var area = document.getElementById('area').value;
    state.textContent = '검색 중…';
    fetch('/api/numbers?country=' + encodeURIComponent(country) + '&area=' + encodeURIComponent(area))
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (d) {
        render(d.numbers);
        state.textContent = d.numbers.length ? '' : '이 지역번호에는 예시 번호가 없습니다. 다른 지역번호를 입력해 보세요.';
      })
      .catch(function () { list.textContent = ''; state.textContent = '목록을 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.'; });
  }

  document.getElementById('filters').addEventListener('submit', function (e) { e.preventDefault(); search(); });
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { go(Number(b.dataset.go)); });
  });
  document.getElementById('finish').addEventListener('click', function () { go(4); });
  document.getElementById('restart').addEventListener('click', function () { go(1); });
  search();
})();
