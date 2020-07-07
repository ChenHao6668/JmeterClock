/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 66.66666666666667, "KoPercent": 33.333333333333336};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3888888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "\u5220\u9664\u535A\u6587\u63A5\u53E3_\u5220\u9664blog_name\u4E3AIDO\u7684\u529F\u80FD\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [0.0, 500, 1500, "\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [0.0, 500, 1500, "\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [0.5, 500, 1500, "\u521D\u59CB\u5316\u767B\u5F55"], "isController": false}, {"data": [0.5, 500, 1500, "\u6DFB\u52A0\u535A\u6587\u63A5\u53E3_\u9A8C\u8BC1blog_name\u4E3AIDO\u65F6\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [1.0, 500, 1500, "\u8C03\u8BD5\u53D6\u6837\u5668_\u67E5\u770BloginName\u7684\u53D8\u91CF\u4FE1\u606F:IDO"], "isController": false}, {"data": [0.0, 500, 1500, "\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [0.0, 500, 1500, "\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38"], "isController": false}, {"data": [1.0, 500, 1500, "\u8C03\u8BD5\u53D6\u6837\u5668_\u67E5\u770Bblog_name\u7684\u53D8\u91CF\u4FE1\u606F:IDO"], "isController": false}, {"data": [0.5, 500, 1500, "\u521D\u59CB\u5316\u9000\u51FA"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18, 6, 33.333333333333336, 693.7222222222223, 1, 1107, 725.5, 1071.9, 1107.0, 1107.0, 1.4146494812951902, 1.2358995549748506, 0.4291840223200251], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\u5220\u9664\u535A\u6587\u63A5\u53E3_\u5220\u9664blog_name\u4E3AIDO\u7684\u529F\u80FD\u662F\u5426\u6B63\u5E38", 4, 0, 0.0, 855.0, 736, 1068, 808.0, 1068.0, 1068.0, 1068.0, 0.6864595846919512, 0.6904818088210056, 0.25641678822721814], "isController": false}, {"data": ["\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 2, 2, 100.0, 747.5, 715, 780, 747.5, 780.0, 780.0, 780.0, 0.18848364904344547, 0.1757830906606352, 0.06515938648572236], "isController": false}, {"data": ["\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 1, 1, 100.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 1.3116978727144868, 0.4862209915611815], "isController": false}, {"data": ["\u521D\u59CB\u5316\u767B\u5F55", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.9934895833333334, 0.3033854166666667], "isController": false}, {"data": ["\u6DFB\u52A0\u535A\u6587\u63A5\u53E3_\u9A8C\u8BC1blog_name\u4E3AIDO\u65F6\u662F\u5426\u6B63\u5E38", 4, 0, 0.0, 810.0, 609, 1107, 762.0, 1107.0, 1107.0, 1107.0, 0.670803286936106, 0.6714583682710045, 0.24696566325674996], "isController": false}, {"data": ["\u8C03\u8BD5\u53D6\u6837\u5668_\u67E5\u770BloginName\u7684\u53D8\u91CF\u4FE1\u606F:IDO", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 324.21875, 0.0], "isController": false}, {"data": ["\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 2, 2, 100.0, 776.5, 640, 913, 776.5, 913.0, 913.0, 913.0, 0.1895195678953852, 0.1800806050412205, 0.06718320619728986], "isController": false}, {"data": ["\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 1, 1, 100.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 1.3364209739803095, 0.49858254219409287], "isController": false}, {"data": ["\u8C03\u8BD5\u53D6\u6837\u5668_\u67E5\u770Bblog_name\u7684\u53D8\u91CF\u4FE1\u606F:IDO", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 414.0625, 0.0], "isController": false}, {"data": ["\u521D\u59CB\u5316\u9000\u51FA", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.9362086776859504, 0.2744059917355372], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/\\u8001\\u5F90\\\/", 1, 16.666666666666668, 5.555555555555555], "isController": false}, {"data": ["Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 4, 66.66666666666667, 22.22222222222222], "isController": false}, {"data": ["Value expected to be \'\\u8001\', but found \'??\'", 1, 16.666666666666668, 5.555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18, 6, "Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 4, "Test failed: text expected to contain \\\/\\u8001\\u5F90\\\/", 1, "Value expected to be \'\\u8001\', but found \'??\'", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 2, 2, "Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 1, "Value expected to be \'\\u8001\', but found \'??\'", 1, null, null, null, null, null, null], "isController": false}, {"data": ["\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 1, 1, "Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\u6DFB\u52A0\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u4E00\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 2, 2, "Test failed: text expected to contain \\\/\\u8001\\u5F90\\\/", 1, "Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 1, null, null, null, null, null, null], "isController": false}, {"data": ["\u7F16\u8F91\u63A5\u53E3_\u8FB9\u754C\u503C_\u9A8C\u8BC1login_name\u4E3A\u5341\u4E2A\u53C2\u6570\u65F6\u662F\u5426\u6B63\u5E38", 1, 1, "Value expected to be \'\\u8001\\u5F90\', but found \'??\'", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
