// 初始化地图并设置米兰为中心
var map = L.map('map').setView([45.4642, 9.19], 12);
            
// 使用 OpenStreetMap 图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 表单逻辑
var openFormBtn = document.getElementById('openFormBtn');
var formPopup = document.getElementById('formPopup');
var closeFormBtn = document.getElementById('closeFormBtn');
var submissionForm = document.getElementById('submissionForm');

// 点击 "提交信息" 按钮，显示表单
openFormBtn.addEventListener('click', function() {
    formPopup.style.display = 'block';
});

// 点击 "取消" 按钮，隐藏表单
closeFormBtn.addEventListener('click', function() {
    formPopup.style.display = 'none';
});

// 提交表单
submissionForm.addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    // 获取表单数据
    var formData = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    // 在这里发送表单数据到服务器（这部分代码可以调整为实际的提交逻辑）
    fetch('https://milano-map-dzl.asia/submit', {  // 替换为你服务器的地址
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('提交成功:', data);
        alert('信息已提交！');
    })
    .catch(error => {
        console.error('提交失败:', error);
        alert('提交失败，请重试。');
    });

    // 提交成功后隐藏表单
    formPopup.style.display = 'none';
    alert('信息已提交！');
});

function toggleNearbyAddress() {
    var shareAddress = document.getElementById("shareAddress").value;
    var nearbyAddressContainer = document.getElementById("nearbyAddressContainer");
    
    if (shareAddress === "yes") {
        nearbyAddressContainer.style.display = "block";
    } else {
        nearbyAddressContainer.style.display = "none";
    }
}


// 创建图标注释控制层
var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h6 class="legend-title">图标注释</h6>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/2702/2702604.png" alt="classmate"> 同学住址<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/9237/9237589.png" alt="restaurant"> 中餐<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/992/992717.png" alt="cake"> 甜品<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/3170/3170733.png" alt="pizza"> 西餐<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/450/450098.png" alt="cake"> 烧烤<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/890/890076.png" alt="pizza"> 火锅<br>';
    div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/128/2252/2252075.png" alt="cake"> 日料<br>';
    // div.innerHTML += '<img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="pizza"> 披萨店<br>';
    
    return div;
};

legend.addTo(map);


// 预定义的图标
var restaurantIcons = {
  "中餐": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/9237/9237589.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "火锅": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/890/890076.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "烤肉": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/450/450098.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "日料": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/2252/2252075.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "甜品": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/992/992717.png',
      iconSize: [20, 20],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "西餐": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/3170/3170733.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "默认": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
      iconSize: [25, 30],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  })
};

var classmates = {
  "男生": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/14035/14035451.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
  "女生": L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/16760/16760371.png',
      iconSize: [25, 25],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
  }),
};

// 密码保护功能
const correctPassword = "dongzhuolin";  

// 加载 JSON 数据
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // 添加饭店标记
    data.restaurants.forEach(restaurant => {
      // 获取餐厅的类型
      var cate = restaurant.type;
      // 根据类型获取图标，如果找不到类型，使用默认图标
      var icon = restaurantIcons[cate] || restaurantIcons["默认"];

      // 使用映射的图标创建标记
      L.marker(restaurant.location, { icon: icon })
        .addTo(map)
        .bindPopup(`店名：${restaurant.name}<br>地址：${restaurant.address}<br>特色：${restaurant.description}<br>价格：${restaurant.price}`);
    });

    // 当点击按钮时，触发密码验证并显示同学住址
    document.getElementById("showAddressBtn").addEventListener("click", () => {
      const inputPassword = prompt("请输入密码查看同学住址：");

      if (inputPassword === correctPassword) {
        // 添加同学住址标记
        data.classmates.forEach(classmate => {
          const cate = classmate.type;
          L.marker(classmate.location, { icon: classmates[cate] })
            .addTo(map)
            .bindPopup(`Who lives here?<br>${classmate.name}`);
        });
        alert("住址已显示！");
      } else {
        alert("密码错误，无法显示住址。");
      }
    });
  })
  .catch(error => {
    console.error('加载数据失败:', error);
  });
