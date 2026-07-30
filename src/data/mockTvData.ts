import { TvChannel, ProgramSchedule } from '../types';

export const RAW_M3U_PLAYLIST = `#EXTM3U
#EXTINF:-1 tvg-id="vtv1" tvg-name="VTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/a/ac/1vv.png/revision/latest/scale-to-width-down/1000?cb=20260604052331&path-prefix=vi" group-title="Kênh VTV",VTV1 HD
https://live.fptplay53.net/live/media/vtv1/live247-hls-avc/vtv1-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv2" tvg-name="VTV2 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/5/5b/2f.png/revision/latest/scale-to-width-down/1000?cb=20260604052625&path-prefix=vi" group-title="Kênh VTV",VTV2 HD
https://live.fptplay53.net/live/media/v2abr/live247-hls-avc/v2abr-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv3" tvg-name="VTV3 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/3/32/V3.png/revision/latest/scale-to-width-down/1000?cb=20260601093014&path-prefix=vi" group-title="Kênh VTV",VTV3 HD
https://live.fptplay53.net/live/media/v3abr/live247-hls-avc/v3abr-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv4" tvg-name="VTV4 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/0/02/Imagei4.png/revision/latest/scale-to-width-down/1000?cb=20260601093135&path-prefix=vi" group-title="Kênh VTV",VTV4 HD
https://live.fptplay53.net/live/media/vtv4/live247-hls-avc/vtv4-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv5" tvg-name="VTV5 HD" tvg-logo="https://static.wikia.nocookie.net/79/Imagej42.png/revision/latest/scale-to-width-down/1000?cb=20260601093345&path-prefix=vi" group-title="Kênh VTV",VTV5 HD
https://live.fptplay53.net/live/media/vtv5/live247-hls-avc/vtv5-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv6" tvg-name="VTV6 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/c/c1/V6.png/revision/latest/scale-to-width-down/1000?cb=20260601093700&path-prefix=vi" group-title="Kênh VTV",VTV6 HD
https://live.fptplay53.net/live/media/v6abr/live247-hls-avc/v6abr-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vtv7" tvg-name="VTV7 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/4/43/Image7.png/revision/latest/scale-to-width-down/1000?cb=20260601093859&path-prefix=vi" group-title="Kênh VTV",VTV7 HD
https://live.fptplay53.net/live/media/v7abr/live247-hls-avc/v7abr-avc1_5600000=10000-mp4a_140800_vie=20000.m3u8
#EXTINF:-1 tvg-id="vtv8" tvg-name="VTV8 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/b/b1/Imagea8.png/revision/latest/scale-to-width-down/1000?cb=20260601094212&path-prefix=vi" group-title="Kênh VTV",VTV8 HD
https://live.fptplay53.net/fnxsd1/vtv8hd_vhls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="vtv9" tvg-name="VTV9 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/8/8c/Imagei9.png/revision/latest/scale-to-width-down/1000?cb=20260601094610&path-prefix=vi" group-title="Kênh VTV",VTV9 HD
https://live.fptplay53.net/live/media/v9abr/live247-hls-avc/v9abr-avc1_5600000=10000-mp4a_140800_vie=20000.m3u8
#EXTINF:-1 tvg-id="vtv10" tvg-name="VTV10 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/a/a0/I10.png/revision/latest/scale-to-width-down/1000?cb=20260601094723&path-prefix=vi" group-title="Kênh VTV",VTV10 HD
https://live.fptplay53.net/live/media/v10abr/live247-hls-avc/v10abr-avc1_5600000=10000-mp4a_131600=20000.m3u8
#EXTINF:-1 tvg-id="vn_today" tvg-name="Vietnam Today HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/7/7f/Vtd.png/revision/latest/scale-to-width-down/1000?cb=20260601094859&path-prefix=vi" group-title="Kênh VTV",Vietnam Today HD
https://live.fptplay53.net/fnxhd1/vntoday_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="on_trending" tvg-name="ON TRENDING TV HD" tvg-logo="https://img.vtvprime.vn/55xu-sW33ZbTdC_Jok1jkP6jWGpa3U96dXvvDuXoyz0/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGZjNzVhY2EtYjZhYS00MjYwLWIwMDMtZDRkYzg4OWI4ZGNkLnBuZw==.png" group-title="Kênh VTVcab",ON TRENDING TV HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=186
#EXTINF:-1 tvg-id="on_kids" tvg-name="ON Kids HD" tvg-logo="https://img.vtvprime.vn/L7ERumqY3GEtK8vTe_DtMEJRYJkZPrVD3O4cbdT5P44/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGFlYmUzZGMtODZmYS00NGFkLTlhNzUtODg5NmFkODZhNGI3LnBuZw==.png" group-title="Kênh VTVcab",ON Kids HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=179
#EXTINF:-1 tvg-id="on_golf" tvg-name="ON Golf HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/f/ff/ON_Golf_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20220311023800&path-prefix=vi" group-title="Kênh VTVcab",ON Golf HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=169
#EXTINF:-1 tvg-id="on_e_channel" tvg-name="ON E- Channel HD" tvg-logo="https://img.vtvprime.vn/bofK3Lca_KQJMc9sb6pUyQ_A41aWbsQi2ibNAzkN3I0/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTk3YjgwOGUtNjI3OS00NWQ4LWJkMTAtNWY1MGE1MjIwMTZkLnBuZw==.png" group-title="Kênh VTVcab",ON E- Channel HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=182
#EXTINF:-1 tvg-id="on_vie_giaitri" tvg-name="ON Vie Giải Trí HD" tvg-logo="https://img.vtvprime.vn/gV1k4G1mCGQpnNGJFCJQISd0-p96jY14Ufz_mOb8h_o/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZjVhZDhkNmBiMTQ4NS00YjYxLThhMDEtNTdiYzBiMjU2NGU1LnBuZw==.png" group-title="Kênh VTVcab",ON Vie Giải Trí HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=180
#EXTINF:-1 tvg-id="on_vie_dramas" tvg-name="ON Vie Dramas HD" tvg-logo="https://img.vtvprime.vn/mVzz9rvhJ_BCun2e4ILB0OYl8ptcxG9TsSrIZ85kpLk/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvMmExZjgwNGYtNjc0Yi00ZjYzLThjZWMtNjgwN2NkNThhYTRkLnBuZw==.png" group-title="Kênh VTVcab",ON Vie Dramas HD
http://dvrfl05.bozztv.com/vch_vchannel18/tracks-v1a1/mono.m3u8
#EXTINF:-1 tvg-id="on_phimviet" tvg-name="ON Phim Việt HD" tvg-logo="https://img.vtvprime.vn/vDASEJI2IRP0eBox0ta6hgKo4vnY-3AdofWLa5lSqjM/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTc3YzdkNmItZTVhNi00ZTkyLWIzYzUtMGEzMTkyZjIyM2RhLnBuZw==.png" group-title="Kênh VTVcab",ON Phim Việt HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=175
#EXTINF:-1 tvg-id="on_movies_youtv" tvg-name="ON Movies - You TV HD" tvg-logo="https://img.vtvprime.vn/8-eDFNeJkwyONvmJVu_JydPc2dZaNJXuBTY7vtvCxxE/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZWQzOTEzNjgtYTJmNy00NDBkLWI0N2ItNzA2MDliNjJmNDYzLnBuZw==.png" group-title="Kênh VTVcab",ON Movies - You TV HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=181
#EXTINF:-1 tvg-id="on_o2tv" tvg-name="ON O2TV HD" tvg-logo="https://img.vtvprime.vn/5FxYjiz34GsArbti7aFiSkIO7NMCxKNZcQJ9AvIme80/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvODAyNGIwMDQtNGJiNC00M2Y3LWJkYmEtYmU0MWVkMGY0NjM4LnBuZw==.png" group-title="Kênh VTVcab",ON O2TV HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=136
#EXTINF:-1 tvg-id="on_bibi" tvg-name="ON BiBi HD" tvg-logo="https://img.vtvprime.vn/vjXRRLGeFrNx1iAkqhrK9RoAgU1oW6kq5q_6r7cd9zs/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvYzI3NWExNmEtNTMwOS00ZWE3LWJjMjMtYTMyNGIwZDczNGJlLnBuZw==.png" group-title="Kênh VTVcab",ON BiBi HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=178
#EXTINF:-1 tvg-id="on_infotv" tvg-name="ON Info TV HD" tvg-logo="https://img.vtvprime.vn/nCr-YgSmtNg5gcpJ35d6l_T4DUWz8fzr9EJpd9jAZ6E/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvM2E2NzM5NzQtNzRhYi00MjYxLTg2M2QtZWE2YzUyNzU5YzcyLnBuZw==.png" group-title="Kênh VTVcab",ON Info TV HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=189
#EXTINF:-1 tvg-id="on_cine" tvg-name="ON Cine HD" tvg-logo="https://img.vtvprime.vn/XY6SjolNpy8W8Eh_v_2oDyE6BiNOvofLosgPYO-hlY4/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvZTY5YjgyNmUtNjkzYi00YzBiLWFhZmYtNmFhZGFjZjFhZDA0LnBuZw==.png" group-title="Kênh VTVcab",ON Cine HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=176
#EXTINF:-1 tvg-id="on_styletv" tvg-name="ON Style TV HD" tvg-logo="https://img.vtvprime.vn/TxObOi0p9hC6K414i12Fk27SP8s_QKswAvPaRH2kK6M/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvNTcyOGM3MzEtOWE4OS00ZjljLTkyYTItMWVhODZmNzhiOWE4LnBuZw==.png" group-title="Kênh VTVcab",ON Style TV HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=184
#EXTINF:-1 tvg-id="on_music" tvg-name="ON Music HD" tvg-logo="https://img.vtvprime.vn/39RnkA6ZHfNSCcsMaaSivvTVwmWjeGsbqlQsmD7nuvQ/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvN7RmOTYzYTYtZWRkYS00MDdjLWIxYmYtYTAwODBhMTUyYTNlLnBuZw==.png" group-title="Kênh VTVcab",ON Music HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=185
#EXTINF:-1 tvg-id="on_vfamily" tvg-name="ON V Family HD" tvg-logo="https://img.vtvprime.vn/8oeGePxG0Z-iJqm5biFVNdMdAlVHFDYsS0i7i3IpH2Y/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvOGI0YzYzOTgtNWJiOS00ODQ1LWE1ZjMtZTdhZTM5ZTc4NzVmLnBuZw==.png" group-title="Kênh VTVcab",ON V Family HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=187
#EXTINF:-1 tvg-id="on_life" tvg-name="ON Life HD" tvg-logo="https://img.vtvprime.vn/cJ9URVIqC2BkU1gsT0IKiEy0tXDXqu7C4M3Ni3hjlgY/rs:fit:836:468/czM6Ly9wcmQtc24taW1hZ2VzL2NoYW5uZWwvY2U2MWMwZGEtMWI1Zi00ZWJiLWE4ZTktZjdmZTVkNzRlODhmLnBuZw==.png" group-title="Kênh VTVcab",ON Life HD
https://vpsttt.vietanhtv.top/tv360/tv360.php?id=188
#EXTINF:-1 tvg-id="htv1" tvg-name="HTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/0/04/HTV1.png/revision/latest/scale-to-width-down/1000?cb=20260601104705&path-prefix=vi" group-title="Kênh HTV",HTV1 HD
https://live.fptplay53.net/epzhd1/htv1_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="htv2" tvg-name="HTV2 / Vie Channel HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/9/99/HTV2.png/revision/latest/scale-to-width-down/1000?cb=20260601105845&path-prefix=vi" group-title="Kênh HTV",HTV2 / Vie Channel HD
https://live.fptplay53.net/epzhd1/htv2hd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htv3" tvg-name="HTV3 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/2/26/H3.png/revision/latest/scale-to-width-down/1000?cb=20260601110041&path-prefix=vi" group-title="Kênh HTV",HTV3 HD
https://live.fptplay53.net/epzhd1/htv3_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="htv4" tvg-name="HTV4 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/d/d4/H4.png/revision/latest/scale-to-width-down/1000?cb=20260601110245&path-prefix=vi" group-title="Kênh HTV",HTV4 HD
https://live.fptplay53.net/epzhd1/htv4_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="htv5" tvg-name="HTV5 / B Channel HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/e/ec/H5.png/revision/latest/scale-to-width-down/1000?cb=20260601110811&path-prefix=vi" group-title="Kênh HTV",HTV5 / B Channel HD
https://live.fptplay53.net/fnxsd1/btv9_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="htv7" tvg-name="HTV7 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/6/60/H7.png/revision/latest/scale-to-width-down/1000?cb=20260601112033&path-prefix=vi" group-title="Kênh HTV",HTV7 HD
https://live.fptplay53.net/epzhd1/htv7hd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htv9" tvg-name="HTV9 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/e/e4/H9.png/revision/latest/scale-to-width-down/1000?cb=20260601111956&path-prefix=vi" group-title="Kênh HTV",HTV9 HD
https://live.fptplay53.net/epzhd1/htv9hd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htv_thethao" tvg-name="HTV Thể Thao HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/5/5c/H6.png/revision/latest/scale-to-width-down/1000?cb=20260601112653&path-prefix=vi" group-title="Kênh HTV",HTV Thể Thao HD
https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_thethao" tvg-name="HTVC Thể Thao HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/d/d4/HTVC_Th%E1%BB%83_thao.png" group-title="Kênh HTV",HTVC Thể Thao HD
https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_canhac" tvg-name="HTVC Ca Nhạc HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/a/ad/HTVC_Ca_nh%E1%BA%A1c.png" group-title="Kênh HTV",HTVC Ca Nhạc HD
https://live.fptplay53.net/epzhd1/htvcmusic_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_dulich" tvg-name="HTVC Du Lịch HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/9/98/HTVC_Du_l%E1%BB%8Bch.png" group-title="Kênh HTV",HTVC Du Lịch HD
https://live.fptplay53.net/epzhd1/htvcdulich_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_giadinh" tvg-name="HTVC Gia Đình HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/1/18/HTVC_Gia_%C4%91%C3%ACnh.png" group-title="Kênh HTV",HTVC Gia Đình HD
https://live.fptplay53.net/epzhd1/htvcgiadinh_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_phimhd" tvg-name="HTVC Phim HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/3/36/HTVC_Phim.png" group-title="Kênh HTV",HTVC Phim HD
https://live.fptplay53.net/epzhd1/htvcmovieshd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_phunu" tvg-name="HTVC Phụ Nữ HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/4/4e/HTVC_Ph%E1%BB%A5_n%E1%BB%AF.png" group-title="Kênh HTV",HTVC Phụ Nữ HD
https://live.fptplay53.net/epzhd1/htvcphunu_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_thuanviethd" tvg-name="HTVC Thuần Việt HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/3/3a/Thu%E1%BA%A7n_Vi%E1%BB%87t.png" group-title="Kênh HTV",HTVC Thuần Việt HD
https://live.fptplay53.net/epzhd1/htvcthuanviethd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="htvc_plus_hd" tvg-name="HTVC+ HD" tvg-logo="https://upload.wikimedia.org/wikipedia/vi/e/ec/HTVC_Plus.png" group-title="Kênh HTV",HTVC+ HD
https://live.fptplay53.net/epzhd1/htvcplus_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="sctv1" tvg-name="SCTV1 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/3/3c/SCTV1.png/revision/latest/scale-to-width-down/1000?cb=20201119113949&path-prefix=vi" group-title="Kênh SCTV",SCTV1 HD
https://hoiquan.dpdns.org/VTVGo/?sctv1
#EXTINF:-1 tvg-id="sctv2" tvg-name="SCTV2 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/6/64/SCTV2.png/revision/latest/scale-to-width-down/1000?cb=20201119114104&path-prefix=vi" group-title="Kênh SCTV",SCTV2 HD
https://liveh12.vtvprime.vn/hls/SCTV2/03.m3u8
#EXTINF:-1 tvg-id="sctv3" tvg-name="SCTV3 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/4/4a/SCTV3.png/revision/latest/scale-to-width-down/1000?cb=20210819101244&path-prefix=vi" group-title="Kênh SCTV",SCTV3 HD
https://hoiquan.dpdns.org/VTVGo/?sctv3
#EXTINF:-1 tvg-id="sctv4" tvg-name="SCTV4 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/6/62/SCTV4.png/revision/latest/scale-to-width-down/1000?cb=20240116011558&path-prefix=vi" group-title="Kênh SCTV",SCTV4 HD
https://hoiquan.dpdns.org/VTVGo/?sctv4
#EXTINF:-1 tvg-id="sctv5" tvg-name="SCTV5 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/e/e7/SCTV5.png/revision/latest/scale-to-width-down/1000?cb=20210819100021&path-prefix=vi" group-title="Kênh SCTV",SCTV5 HD
https://hoiquan.dpdns.org/VTVGo/?sctv5
#EXTINF:-1 tvg-id="sctv6" tvg-name="SCTV6 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/4/4b/SCTV6.png/revision/latest/scale-to-width-down/1000?cb=20210819100633&path-prefix=vi" group-title="Kênh SCTV",SCTV6 HD
https://live.fptplay53.net/epzhd2/film360_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="sctv7" tvg-name="SCTV7 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/8/87/SCTV7.png/revision/latest/scale-to-width-down/1000?cb=20210819102155&path-prefix=vi" group-title="Kênh SCTV",SCTV7 HD
https://hoiquan.dpdns.org/VTVGo/?sctv7
#EXTINF:-1 tvg-id="sctv8" tvg-name="SCTV8 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/0/05/SCTV8.png/revision/latest/scale-to-width-down/1000?cb=20210819103024&path-prefix=vi" group-title="Kênh SCTV",SCTV8 HD
https://hoiquan.dpdns.org/VTVGo/?sctv8
#EXTINF:-1 tvg-id="sctv9" tvg-name="SCTV9 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/f/f3/SCTV9.png/revision/latest/scale-to-width-down/1000?cb=20210821040105&path-prefix=vi" group-title="Kênh SCTV",SCTV9 HD
https://hoiquan.dpdns.org/VTVGo/?sctv9
#EXTINF:-1 tvg-id="sctv10" tvg-name="SCTV10 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/c/c0/SCTV10.png/revision/latest/scale-to-width-down/1000?cb=20210819105314&path-prefix=vi" group-title="Kênh SCTV",SCTV10 HD
https://liveh34.vtvprime.vn/hls/SCTV10/01.m3u8
#EXTINF:-1 tvg-id="sctv11" tvg-name="SCTV11 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/7/7d/SCTV11.png/revision/latest/scale-to-width-down/1000?cb=20210821040108&path-prefix=vi" group-title="Kênh SCTV",SCTV11 HD
https://hoiquan.dpdns.org/VTVGo/?sctv11
#EXTINF:-1 tvg-id="sctv12" tvg-name="SCTV12 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/5/51/SCTV12.png/revision/latest/scale-to-width-down/1000?cb=20201127035429&path-prefix=vi" group-title="Kênh SCTV",SCTV12 HD
https://hoiquan.dpdns.org/VTVGo/?sctv12
#EXTINF:-1 tvg-id="sctv13" tvg-name="SCTV13 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/c/c1/SCTV13_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20230630142130&path-prefix=vi" group-title="Kênh SCTV",SCTV13 HD
https://hoiquan.dpdns.org/VTVGo/?sctv13
#EXTINF:-1 tvg-id="sctv14" tvg-name="SCTV14 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/1/12/SCTV14_logo_2022.png/revision/latest/scale-to-width-down/1000?cb=20220428035033&path-prefix=vi" group-title="Kênh SCTV",SCTV14 HD
https://hoiquan.dpdns.org/VTVGo/?sctv14
#EXTINF:-1 tvg-id="sctv15" tvg-name="SCTV15 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/9/92/SCTV15.png/revision/latest/scale-to-width-down/1000?cb=20210820043237&path-prefix=vi" group-title="Kênh SCTV",SCTV15 HD
https://hoiquan.dpdns.org/VTVGo/?sctv15
#EXTINF:-1 tvg-id="sctv16" tvg-name="SCTV16 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/a/aa/SCTV16.png/revision/latest/scale-to-width-down/1000?cb=20210820043927&path-prefix=vi" group-title="Kênh SCTV",SCTV16 HD
https://hoiquan.dpdns.org/VTVGo/?sctv16
#EXTINF:-1 tvg-id="sctv17" tvg-name="SCTV17 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/0/0a/SCTV17.png/revision/latest/scale-to-width-down/1000?cb=20210820120340&path-prefix=vi" group-title="Kênh SCTV",SCTV17 HD
https://hoiquan.dpdns.org/VTVGo/?sctv17
#EXTINF:-1 tvg-id="sctv18" tvg-name="SCTV18 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/c/ca/SCTV18.png/revision/latest/scale-to-width-down/1000?cb=20210820120952&path-prefix=vi" group-title="Kênh SCTV",SCTV18 HD
https://hoiquan.dpdns.org/VTVGo/?sctv18
#EXTINF:-1 tvg-id="sctv19" tvg-name="SCTV19 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/e/ef/SCTV19.png/revision/latest/scale-to-width-down/1000?cb=20240131141543&path-prefix=vi" group-title="Kênh SCTV",SCTV19 HD
https://hoiquan.dpdns.org/VTVGo/?sctv19
#EXTINF:-1 tvg-id="sctv20" tvg-name="SCTV20 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/b/b1/SCTV20.png/revision/latest/scale-to-width-down/1000?cb=20210821042852&path-prefix=vi" group-title="Kênh SCTV",SCTV20 HD
https://hoiquan.dpdns.org/VTVGo/?sctv20
#EXTINF:-1 tvg-id="sctv21" tvg-name="SCTV21 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/9/9f/SCTV21.png/revision/latest/scale-to-width-down/1000?cb=20210821043405&path-prefix=vi" group-title="Kênh SCTV",SCTV21 HD
https://hoiquan.dpdns.org/VTVGo/?sctv21
#EXTINF:-1 tvg-id="sctv22" tvg-name="SCTV22 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/5/5f/SCTV22.png/revision/latest/scale-to-width-down/1000?cb=20210821035512&path-prefix=vi" group-title="Kênh SCTV",SCTV22 HD
https://hoiquan.dpdns.org/VTVGo/?sctv22
#EXTINF:-1 tvg-id="sctv_phim" tvg-name="SCTV Phim HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/1/12/SCTV_Phim_T%E1%BB%95ng_h%E1%BB%A3p_2020.png/revision/latest?cb=20230323070113&path-prefix=vi" group-title="Kênh SCTV",SCTV Phim HD
https://hoiquan.dpdns.org/VTVGo/?sctvphim
#EXTINF:-1 tvg-id="antv_thiet_yeu" tvg-name="Truyền hình Công an Nhân dân (ANTV) HD" tvg-logo="https://img-zlr1.tv360.vn/image1/2020_09_23/1600822516608/b33963dc0df8_640_360.png" group-title="Kênh thiết yếu",Truyền hình Công an Nhân dân (ANTV) HD
https://live.fptplay53.net/fnxhd2/anninhtv_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="qpvn_thiet_yeu" tvg-name="Truyền hình Quốc phòng Việt Nam (QPVN) HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/5/5d/QPVN.png/revision/latest/scale-to-width-down/1000?cb=20220827083916&path-prefix=vi" group-title="Kênh thiết yếu",Truyền hình Quốc phòng Việt Nam (QPVN) HD
https://live.fptplay53.net/fnxhd2/quocphongvnhd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="atv1" tvg-name="Truyền hình An Giang - ATV1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/f/f3/Atv.png/revision/latest/scale-to-width-down/1000?cb=20260601113339&path-prefix=vi" group-title="Kênh địa phương",Truyền hình An Giang - ATV1 HD
https://live.fptplay53.net/epzsd1/angiang01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="atv2" tvg-name="Truyền hình An Giang - ATV2 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/5/57/2a.png/revision/latest/scale-to-width-down/1000?cb=20260601113455&path-prefix=vi" group-title="Kênh địa phương",Truyền hình An Giang - ATV2 HD
https://live.fptplay53.net/epzsd1/angiang_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="atv3" tvg-name="Truyền hình An Giang - ATV3 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/a/ae/Atv3.png/revision/latest/scale-to-width-down/1000?cb=20260601113538&path-prefix=vi" group-title="Kênh địa phương",Truyền hình An Giang - ATV3 HD
https://live.fptplay53.net/epzsd1/angiang03_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="bac_ninh" tvg-name="Truyền hình Bắc Ninh - BTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/7/70/BTVHD.png/revision/latest/scale-to-width-down/1000?cb=20260706052923" group-title="Kênh địa phương",Truyền hình Bắc Ninh - BTV HD
https://live.fptplay53.net/fnxsd1/bacninh01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="ca_mau" tvg-name="Truyền hình Cà Mau - CTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/5/55/CTVHD.png/revision/latest/scale-to-width-down/1000?cb=20260706053344" group-title="Kênh địa phương",Truyền hình Cà Mau - CTV HD
https://live.fptplay53.net/epzsd1/camau_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="cao_bang" tvg-name="Truyền hình Cao Bằng - CRTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/e/ec/Caob.png/revision/latest/scale-to-width-down/1000?cb=20260702004111" group-title="Kênh địa phương",Truyền hình Cao Bằng - CRTV HD
https://live.fptplay53.net/fnxsd1/caobang_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="can_tho_1" tvg-name="Truyền hình Cần Thơ - CầnThơ 1 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/a/a9/Cansa.png/revision/latest/scale-to-width-down/1000?cb=20260701135206" group-title="Kênh địa phương",Truyền hình Cần Thơ - CầnThơ 1 HD
https://live.fptplay53.net/epzsd1/cantho_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="can_tho_2" tvg-name="Truyền hình Cần Thơ - CầnThơ 2 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/a/a4/C2.png/revision/latest/scale-to-width-down/1000?cb=20260701135242" group-title="Kênh địa phương",Truyền hình Cần Thơ - CầnThơ 2 HD
https://live.fptplay53.net/epzsd1/cantho02_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="can_tho_3" tvg-name="Truyền hình Cần Thơ - CầnThơ 3 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/5/54/C3.png/revision/latest/scale-to-width-down/1000?cb=20260701135509" group-title="Kênh địa phương",Truyền hình Cần Thơ - CầnThơ 3 HD
https://live.fptplay53.net/epzsd1/cantho03_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="da_nang_1" tvg-name="Truyền hình Đà Nẵng - ĐNRT1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/c/c6/D1.png/revision/latest/scale-to-width-down/1000?cb=20260601122210&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Đà Nẵng - ĐNRT1 HD
https://live.fptplay53.net/epzsd1/danang1_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="da_nang_2" tvg-name="Truyền hình Đà Nẵng - ĐNRT2 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/8/8b/D2.png/revision/latest/scale-to-width-down/1000?cb=20260601122329&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Đà Nẵng - ĐNRT2 HD
https://live.fptplay53.net/epzsd1/danang2_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="dak_lak" tvg-name="Truyền hình Đắk Lắk - DRT HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/0/07/Derote.png/revision/latest/scale-to-width-down/1000?cb=20260601122629&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Đắk Lắk - DRT HD
https://live.fptplay53.net/epzsd1/daklak_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="dien_bien" tvg-name="Truyền hình Điện Biên - ĐTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/9/94/Dien_bien_deteve.png/revision/latest/scale-to-width-down/1000?cb=20260706054014" group-title="Kênh địa phương",Truyền hình Điện Biên - ĐTV HD
https://live.fptplay53.net/fnxsd1/dienbien_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="dong_nai_1" tvg-name="Truyền hình Đồng Nai - ĐNRTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/9/95/Dong1.png/revision/latest/scale-to-width-down/1000?cb=20260702004514" group-title="Kênh địa phương",Truyền hình Đồng Nai - ĐNRTV1 HD
https://live.fptplay53.net/epzsd1/dongnai1_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="dong_nai_2" tvg-name="Truyền hình Đồng Nai - ĐNRTV2 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/4/41/%C4%902.png/revision/latest/scale-to-width-down/1000?cb=20260702004615" group-title="Kênh địa phương",Truyền hình Đồng Nai - ĐNRTV2 HD
https://live.fptplay53.net/epzsd1/dongnai2_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="gia_lai" tvg-name="Truyền hình Gia Lai - GTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/d/db/Gtvc.png/revision/latest/scale-to-width-down/1000?cb=20260601123951&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Gia Lai - GTV HD
https://live.fptplay53.net/epzsd1/gialai01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="dong_thap_1" tvg-name="Truyền hình Đồng Tháp - THĐT1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/4/44/D8.png/revision/latest/scale-to-width-down/1000?cb=20260601123433&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Đồng Tháp - THĐT1 HD
https://live.fptplay53.net/epzsd1/dongthap_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="dong_thap_2" tvg-name="Truyền hình Đồng Tháp - THĐT2 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/1/14/D9.png/revision/latest/scale-to-width-down/1000?cb=20260601123603&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Đồng Tháp - THĐT2 HD
https://live.fptplay53.net/epzsd1/dongthaphd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="ha_noi_1" tvg-name="Truyền hình Hà Nội - H1 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/4/4e/H1.png/revision/latest/scale-to-width-down/1000?cb=20260702004820" group-title="Kênh địa phương",Truyền hình Hà Nội - H1 HD
https://live.fptplay53.net/fnxhd2/hanoitv1_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="ha_noi_2" tvg-name="Truyền hình Hà Nội - H2 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/7/78/H2.png/revision/latest/scale-to-width-down/1000?cb=20260702004903" group-title="Kênh địa phương",Truyền hình Hà Nội - H2 HD
https://live.fptplay53.net/fnxhd1/hntv2_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="hue" tvg-name="Truyền hình Huế - HueTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/8/8b/Httvv.png/revision/latest/scale-to-width-down/1000?cb=20260602021015&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Huế - HueTV HD
https://live.fptplay53.net/epzsd1/hue_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="ha_tinh" tvg-name="Truyền hình Hà Tĩnh - HTTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/f/f9/Htinh.png/revision/latest/scale-to-width-down/1000?cb=20260602020455&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Hà Tĩnh - HTTV HD
https://live.fptplay53.net/fnxsd1/hatinh_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="hai_phong" tvg-name="Truyền hình Hải Phòng - THP HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/c/c8/Tho1.png/revision/latest/scale-to-width-down/1000?cb=20260706064226" group-title="Kênh địa phương",Truyền hình Hải Phòng - THP HD
https://live.fptplay53.net/fnxsd1/haiphong_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="hai_phong_3" tvg-name="Truyền hình Hải Phòng - THP3 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/b/bd/Imageg4f3.png/revision/latest/scale-to-width-down/1000?cb=20260602020807&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Hải Phòng - THP3 HD
https://live.fptplay53.net/fnxsd1/haiphongplus_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="hung_yen" tvg-name="Truyền hình Hưng Yên - HYTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/9/94/Hytv.png/revision/latest/scale-to-width-down/1000?cb=20260702005210" group-title="Kênh địa phương",Truyền hình Hưng Yên - HYTV HD
https://live.fptplay53.net/fnxsd1/hungyen_2000.stream/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="khanh_hoa" tvg-name="Truyền hình Khánh Hòa - KTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/0/03/K0.png/revision/latest/scale-to-width-down/1000?cb=20260602021528&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Khánh Hòa - KTV HD
https://live.fptplay53.net/epzsd1/khanhhoa_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="khanh_hoa_1" tvg-name="Truyền hình Khánh Hòa - KTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/b/bc/K1.png/revision/latest/scale-to-width-down/1000?cb=20260602021704&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Khánh Hòa - KTV1 HD
https://live.fptplay53.net/epzsd1/khanhhoa01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lai_chau" tvg-name="Truyền hình Lai Châu - LTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/8/81/Laichou.png/revision/latest/scale-to-width-down/1000?cb=20260602021840&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Lai Châu - LTV HD
https://live.fptplay53.net/fnxsd1/laichau_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lao_cai" tvg-name="Truyền hình Lào Cai - THLC HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/2/2d/Thlc.png/revision/latest/scale-to-width-down/1000?cb=20260602022338&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Lào Cai - THLC HD
https://live.fptplay53.net/fnxsd1/laocai_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lang_son" tvg-name="Truyền hình Lạng Sơn - LSTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/e/e0/L%E1%BB%9D_s%E1%BB%9D_t%E1%BB%9D_v%E1%BB%9D.png/revision/latest/scale-to-width-down/1000?cb=20260602022221&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Lạng Sơn - LSTV HD
https://live.fptplay53.net/fnxsd1/langson_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lam_dong_1" tvg-name="Truyền hình Lâm Đồng - LTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/7/76/L1.png/revision/latest/scale-to-width-down/1000?cb=20260706060807" group-title="Kênh địa phương",Truyền hình Lâm Đồng - LTV1 HD
https://live.fptplay53.net/epzsd1/lamdong_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lam_dong_2" tvg-name="Truyền hình Lâm Đồng - LTV2 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/f/ff/Ltv2.png/revision/latest/scale-to-width-down/1000?cb=20260706063410" group-title="Kênh địa phương",Truyền hình Lâm Đồng - LTV2 HD
https://live.fptplay53.net/epzsd1/lamdong02_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="lam_dong_3" tvg-name="Truyền hình Lâm Đồng - LTV3 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/2/2c/L3.png/revision/latest/scale-to-width-down/1000?cb=20260706063528" group-title="Kênh địa phương",Truyền hình Lâm Đồng - LTV3 HD
https://live.fptplay53.net/epzsd1/lamdong03_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="nghe_an" tvg-name="Truyền hình Nghệ An - NTV HD" tvg-logo="https://img-zlr1.tv360.vn/image1/2020_09_23/1600821989411/75bfb004e210_640_360.png" group-title="Kênh địa phương",Truyền hình Nghệ An - NTV HD
https://live.fptplay53.net/fnxsd1/nghean_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="ninh_binh" tvg-name="Truyền hình Ninh Bình - NBTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/4/49/Truyenhinhninhbinh.png/revision/latest/scale-to-width-down/1000?cb=20260602022536&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Ninh Bình - NBTV HD
https://live.fptplay53.net/fnxsd1/ninhbinh_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="phu_tho" tvg-name="Truyền hình Phú Thọ - PTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/8/8e/Ptvhd.png/revision/latest/scale-to-width-down/1000?cb=20260706052313" group-title="Kênh địa phương",Truyền hình Phú Thọ - PTV HD
https://live.fptplay53.net/fnxsd1/phutho_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="quang_ninh_1" tvg-name="Truyền hình Quảng Ninh - QTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/d/d5/Q1.png/revision/latest/scale-to-width-down/1000?cb=20260602023030&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Quảng Ninh - QTV1 HD
https://live.fptplay53.net/fnxsd1/quangninh1_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="quang_ninh_3" tvg-name="Truyền hình Quảng Ninh - QTV3 HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/2/21/Q3.png/revision/latest/scale-to-width-down/1000?cb=20260602023204&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Quảng Ninh - QTV3 HD
https://live.fptplay53.net/fnxsd1/quangninh3_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="quang_ngai_1" tvg-name="Truyền hình Quảng Ngãi - QNgTV1 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/1/1f/Qngtv1.png/revision/latest/scale-to-width-down/1000?cb=20260623103509" group-title="Kênh địa phương",Truyền hình Quảng Ngãi - QNgTV1 HD
https://live.fptplay53.net/epzsd1/quangngai_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="quang_ngai_2" tvg-name="Truyền hình Quảng Ngãi - QNgTV2 HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/1/11/Qngtv.png/revision/latest/scale-to-width-down/1000?cb=20260623103717" group-title="Kênh địa phương",Truyền hình Quảng Ngãi - QNgTV2 HD
https://live.fptplay53.net/epzsd1/quangngai01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="tay_ninh" tvg-name="Truyền hình Tây Ninh - TN HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/5/53/Tn1.png/revision/latest/scale-to-width-down/1000?cb=20260702005350" group-title="Kênh địa phương",Truyền hình Tây Ninh - TN HD
https://live.fptplay53.net/epzsd1/tayninh01_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="son_la" tvg-name="Truyền hình Sơn La - Snews HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/0/03/Snews_test_2.png/revision/latest/scale-to-width-down/1000?cb=20260701105218" group-title="Kênh địa phương",Truyền hình Sơn La - Snews HD
https://live.fptplay53.net/fnxsd1/sonla_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="quang_tri" tvg-name="Truyền hình Quảng Trị - QTTV HD" tvg-logo="https://static.wikia.nocookie.net/ftv/images/b/bf/Imageqtvv.png/revision/latest/scale-to-width-down/1000?cb=20260602023509&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Quảng Trị - QTTV HD
https://live.fptplay53.net/epzsd1/quangtri_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="tuyen_quang" tvg-name="Truyền hình Tuyên Quang - TTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/5/5a/Ttv.png/revision/latest/scale-to-width-down/1000?cb=20260706055252" group-title="Kênh địa phương",Truyền hình Tuyên Quang - TTV HD
https://live.fptplay53.net/fnxsd1/tuyenquang_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="thanh_hoa" tvg-name="Truyền hình Thanh Hóa - TTV HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/9/99/Thanhhoe.png/revision/latest/scale-to-width-down/1000?cb=20260706060048" group-title="Kênh địa phương",Truyền hình Thanh Hóa - TTV HD
https://live.fptplay53.net/fnxsd1/thanhhoa_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="thai_nguyen" tvg-name="Truyền hình Thái Nguyên - TN HD" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/f/fa/Tn.png/revision/latest/scale-to-width-down/1000?cb=20260702005531" group-title="Kênh địa phương",Truyền hình Thái Nguyên - TN HD
https://live.fptplay53.net/fnxsd1/thainguyen_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="vinh_long_1" tvg-name="Truyền hình Vĩnh Long - THVL1 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/3/32/THVL1_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083051&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Vĩnh Long - THVL1 HD
https://live.fptplay53.net/epzhd2/vinhlong1_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="vinh_long_2" tvg-name="Truyền hình Vĩnh Long - THVL2 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/9/98/THVL2_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083053&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Vĩnh Long - THVL2 HD
https://live.fptplay53.net/epzhd2/vinhlong2_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="vinh_long_3" tvg-name="Truyền hình Vĩnh Long - THVL3 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/2/29/THVL3_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083054&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Vĩnh Long - THVL3 HD
https://live.fptplay53.net/epzhd2/vinhlong3_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="vinh_long_4" tvg-name="Truyền hình Vĩnh Long - THVL4 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/7/7e/THVL4_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083055&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Vĩnh Long - THVL4 HD
https://live.fptplay53.net/epzhd2/vinhlong4hd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="vinh_long_5" tvg-name="Truyền hình Vĩnh Long - THVL5 HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/3/3b/THVL5_logo_ident_2025.png/revision/latest/scale-to-width-down/1000?cb=20251206083057&path-prefix=vi" group-title="Kênh địa phương",Truyền hình Vĩnh Long - THVL5 HD
https://live.fptplay53.net/epzsd1/vinhlong5_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="cnn" tvg-name="CNN HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg" group-title="Kênh quốc tế",CNN HD
https://d3bp6dwmpbdajl.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ury0meh5m4nzm/index.m3u8
#EXTINF:-1 tvg-id="bbc_news" tvg-name="BBC News HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/6/62/BBC_News_2022.svg" group-title="Kênh quốc tế",BBC News HD
https://stream8.cinerama.uz/1251/tracks-v1a1/mono.m3u8
#EXTINF:-1 tvg-id="discovery_channel_hd" tvg-name="Discovery Channel HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/e/e5/Discovery_Channel_logo.svg" group-title="Kênh quốc tế",Discovery Channel HD
http://cdn4.skygo.mn/live/disk1/SoutheastAsia/HLSv3-FTA/SoutheastAsia.m3u8
#EXTINF:-1 tvg-id="aljazeera" tvg-name="ALJAZEERA HD" tvg-logo="https://upload.wikimedia.org/wikipedia/en/f/f2/Aljazeera_eng.svg" group-title="Kênh quốc tế",ALJAZEERA HD
https://live-hls-apps-aje-fa.getaj.net/AJE/01.m3u8
#EXTINF:-1 tvg-id="animal_planet" tvg-name="Animal Planet HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/5/53/Animal_Planet_logo_2018.svg" group-title="Kênh quốc tế",Animal Planet HD
https://tiger-hub.vercel.app@vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8
#EXTINF:-1 tvg-id="asian_food_network" tvg-name="ASIAN FOOD NETWORK HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/a/a2/Asian_Food_Network.png" group-title="Kênh quốc tế",ASIAN FOOD NETWORK HD
https://live.fptplay53.net/fnxhd2/afchd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="cartoon_network_intl" tvg-name="Cartoon Network HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/b/bb/Cartoon_Network_logo.svg" group-title="Kênh quốc tế",Cartoon Network HD
http://cdn4.skygo.mn/live/disk1/Cartoon_Network/HLSv3-FTA/Cartoon_Network.m3u8
#EXTINF:-1 tvg-id="kbs_world_intl" tvg-name="KBS World HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/f/f6/KBS_World_2018.svg" group-title="Kênh quốc tế",KBS World HD
https://live.fptplay53.net/epzhd2/kbs_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="nhk_world_japan" tvg-name="NHK World Japan HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/8/87/NHK_World-Japan_logo.svg" group-title="Kênh quốc tế",NHK World Japan HD
https://live.fptplay53.net/fnxhd2/nhkworld_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="tv5_monde" tvg-name="TV5 Monde HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/7/7b/TV5MONDE_logo.svg" group-title="Kênh quốc tế",TV5 Monde HD
https://live.fptplay53.net/fnxhd2/tv5_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="cna" tvg-name="CNA HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/c/c2/Channel_NewsAsia_logo.svg" group-title="Kênh quốc tế",CNA HD
https://live.fptplay53.net/fnxhd2/newsasia_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="cnbc" tvg-name="CNBC HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg" group-title="Kênh quốc tế",CNBC HD
https://live.fptplay53.net/fnxsd1/cnbc_hls.smil/chunklist_b2500000.m3u8
#EXTINF:-1 tvg-id="kix_hd" tvg-name="KIX HD" tvg-logo="https://static.wikia.nocookie.net/logos/images/0/05/KIX_HD.png" group-title="Kênh quốc tế",KIX HD
https://live.fptplay53.net/fnxhd2/kixhd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="outdoor_channel" tvg-name="Outdoor Channel HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/3/36/Outdoor_Channel_logo.svg" group-title="Kênh quốc tế",Outdoor Channel HD
https://live.fptplay53.net/epzhd2/outdoorfhd_vhls.smil/chunklist_b5000000.m3u8
#EXTINF:-1 tvg-id="tvn" tvg-name="tvN HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/b/be/Tvn_logo.svg" group-title="Kênh quốc tế",tvN HD
https://d21dxaer0ypwk1.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-a6m2cy2rylsvo-ssai-prd/54ac8e25_eb5a_4f10_ba20_ffb254f0a16c/hls/playlist.m3u8
#EXTINF:-1 tvg-id="warner_tv_hd" tvg-name="Warner TV HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/5/50/Warner_TV_logo.svg" group-title="Kênh quốc tế",Warner TV HD
http://cdn4.skygo.mn/live/disk1/Warner/HLSv3-FTA/Warner.m3u8
#EXTINF:-1 tvg-id="extreme_sports" tvg-name="Extreme Sports HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/1/18/Extreme_Group_Logo.svg" group-title="Kênh quốc tế",Extreme Sports HD
http://flussonic.mkpnet.ru/tv-1a9441fd32d63873/video.m3u8
#EXTINF:-1 tvg-id="fashion_tv" tvg-name="Fashion TV HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/6/69/Fashion_TV.svg" group-title="Kênh quốc tế",Fashion TV HD
https://stream8.cinerama.uz/1053/tracks-v1a1/mono.m3u8
#EXTINF:-1 tvg-id="bloomberg" tvg-name="Bloomberg HD" tvg-logo="https://upload.wikimedia.org/wikipedia/commons/5/50/Bloomberg_logo.svg" group-title="Kênh quốc tế",Bloomberg HD
https://cdn4.skygo.mn/live/disk1/Bloomberg/HLSv3-FTA/Bloomberg.m3u8
#EXTINF:-1 tvg-id="vov1" tvg-name="VOV1" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/c/c9/V0v1.png/revision/latest/scale-to-width-down/1000?cb=20260622072449" group-title="Kênh phát thanh",VOV1
https://media-audio.vov.vn/vov1vov5Vietnamese.sdp_aac/playlist.m3u8
#EXTINF:-1 tvg-id="vov2" tvg-name="VOV2" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/3/31/V0v2.png/revision/latest/scale-to-width-down/1000?cb=20260622072053" group-title="Kênh phát thanh",VOV2
https://media-audio.vov.vn/vov2.sdp_aac/playlist.m3u8
#EXTINF:-1 tvg-id="vov3" tvg-name="VOV3" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/8/8c/Vov03.png/revision/latest/scale-to-width-down/1000?cb=20260622071720" group-title="Kênh phát thanh",VOV3
https://media-audio.vov.vn/vov3.sdp_aac/playlist.m3u8
#EXTINF:-1 tvg-id="vov4" tvg-name="VOV4" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/3/32/V0v4.png/revision/latest/scale-to-width-down/1000?cb=20260622071948" group-title="Kênh phát thanh",VOV4
http://media.kythuatvov.vn:1936/live/VOV4_TB.sdp/chunklist.m3u8
#EXTINF:-1 tvg-id="vov4_tb" tvg-name="VOV4 Tây Bắc" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/3/32/V0v4.png/revision/latest/scale-to-width-down/1000?cb=20260622071948" group-title="Kênh phát thanh",VOV4 Tây Bắc
http://media.kythuatvov.vn:1936/live/VOV4_TB.sdp/chunklist.m3u8
#EXTINF:-1 tvg-id="vov4_tn" tvg-name="VOV4 Tây Nguyên" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/3/32/V0v4.png/revision/latest/scale-to-width-down/1000?cb=20260622071948" group-title="Kênh phát thanh",VOV4 Tây Nguyên
https://str.vov.gov.vn/vovlive/vov4.TayNguyen.sdp_aac/playlist.m3u8
#EXTINF:-1 tvg-id="vov5" tvg-name="VOV5" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/7/73/Vov5.png/revision/latest/scale-to-width-down/1000?cb=20260622072118" group-title="Kênh phát thanh",VOV5
https://media-audio.vov.vn/vov5.sdp_aac/playlist.m3u8
#EXTINF:-1 tvg-id="vov_giao_thong" tvg-name="VOV Giao Thông" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/6/6a/VOV_GT.png/revision/latest/scale-to-width-down/1000?cb=20260622072341" group-title="Kênh phát thanh",VOV Giao Thông
https://play.vovgiaothong.vn/live/gthn/playlist.m3u8
#EXTINF:-1 tvg-id="vov_gt_hn" tvg-name="VOV Giao Thông Hà Nội" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/6/6a/VOV_GT.png/revision/latest/scale-to-width-down/1000?cb=20260622072341" group-title="Kênh phát thanh",VOV Giao Thông Hà Nội
https://play.vovgiaothong.vn/live/gthn/playlist.m3u8
#EXTINF:-1 tvg-id="vov_gt_hcm" tvg-name="VOV Giao Thông TP.HCM" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/6/6a/VOV_GT.png/revision/latest/scale-to-width-down/1000?cb=20260622072341" group-title="Kênh phát thanh",VOV Giao Thông TP.HCM
https://play.vovgiaothong.vn/live/gthcm/playlist.m3u8
#EXTINF:-1 tvg-id="vov_gt_mekong" tvg-name="VOV Giao Thông Mê Kông" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/6/6a/VOV_GT.png/revision/latest/scale-to-width-down/1000?cb=20260622072341" group-title="Kênh phát thanh",VOV Giao Thông Mê Kông
https://play.vovgiaothong.vn/live/mekong/playlist.m3u8
#EXTINF:-1 tvg-id="vov_gt_duyenhai" tvg-name="VOV Giao Thông Duyên Hải" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/6/6a/VOV_GT.png/revision/latest/scale-to-width-down/1000?cb=20260622072341" group-title="Kênh phát thanh",VOV Giao Thông Duyên Hải
https://play.vovgiaothong.vn/live/duyenhai2/playlist.m3u8
#EXTINF:-1 tvg-id="hanoi_fm90" tvg-name="Hà Nội FM90" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/1/11/Fm90.png/revision/latest/scale-to-width-down/1000?cb=20260622073617" group-title="Kênh phát thanh",Hà Nội FM90
http://14.162.146.90:8000/HANOI90
#EXTINF:-1 tvg-id="hanoi_fm96" tvg-name="Hà Nội FM96" tvg-logo="https://static.wikia.nocookie.net/ep-deo/images/5/55/FM96.png/revision/latest/scale-to-width-down/1000?cb=20260622073735" group-title="Kênh phát thanh",Hà Nội FM96
http://222.252.21.96:8000/HANOI96
`;

// M3U Parser Function to dynamically parse channels
export function parseM3UPlaylist(m3uContent: string): TvChannel[] {
  const lines = m3uContent.split('\n');
  const channels: TvChannel[] = [];
  let currentChannelPartial: Partial<TvChannel> = {};

  const backgroundGradients = [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const idMatch = line.match(/tvg-id="([^"]+)"/);
      const nameMatch = line.match(/tvg-name="([^"]+)"/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      const commaIndex = line.lastIndexOf(',');
      const displayName = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : (nameMatch ? nameMatch[1] : 'Kênh HD');

      const group = groupMatch ? groupMatch[1] : 'Kênh truyền hình';
      const id = idMatch ? idMatch[1] : `channel_${channels.length + 1}`;
      const logo = logoMatch ? logoMatch[1] : '';

      currentChannelPartial = {
        id,
        name: displayName,
        groupTitle: group,
        logo: logo || `https://via.placeholder.com/150/1c1d1f/ffffff?text=${encodeURIComponent(displayName)}`,
        badge: group.includes('phát thanh') ? 'AUDIO' : 'LIVE HD',
        currentProgram: `Trực tiếp 24/7 - ${displayName}`,
        nextProgram: `Chương trình tiếp theo trên ${displayName}`,
        viewers: `${Math.floor(Math.random() * 300 + 50)}.${Math.floor(Math.random() * 9)}K`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1) + '/5',
        videoBg: backgroundGradients[channels.length % backgroundGradients.length],
        isLive: true,
        resolution: group.includes('phát thanh') ? '128kbps AAC' : '1080p60',
        language: 'Tiếng Việt',
        summary: `Chương trình phát sóng trực tiếp từ kênh ${displayName} (${group}).`,
      };
    } else if (line && !line.startsWith('#')) {
      if (currentChannelPartial.id) {
        currentChannelPartial.streamUrl = line;
        channels.push(currentChannelPartial as TvChannel);
        currentChannelPartial = {};
      }
    }
  }

  return channels;
}

export const TV_CHANNELS: TvChannel[] = parseM3UPlaylist(RAW_M3U_PLAYLIST);

export const PROGRAM_SCHEDULES: ProgramSchedule[] = [
  { id: 'p1', time: '18:00 - 19:00', title: 'Chuyển động 24h & Tin tức Tiêu dùng', channelId: 'vtv1', isCurrent: false, category: 'Tin tức', duration: '60 phút' },
  { id: 'p2', time: '19:00 - 20:10', title: 'Thời sự 19h - Bản tin Toàn cảnh Kinh tế & Xã hội', channelId: 'vtv1', isCurrent: true, category: 'Tin tức', duration: '70 phút' },
  { id: 'p3', time: '20:10 - 21:00', title: 'VTV Đặc biệt - Hành trình Di sản Việt Nam', channelId: 'vtv1', isCurrent: false, category: 'Văn hóa', duration: '50 phút' },
  { id: 'p4', time: '21:00 - 22:30', title: 'Phim truyện: Cuộc đời vẫn đẹp sao (Tập 24)', channelId: 'vtv1', isCurrent: false, category: 'Phim', duration: '90 phút' },
  { id: 'p5', time: '18:30 - 20:30', title: 'Trực tiếp Premier League', channelId: 'on_golf', isCurrent: true, category: 'Thể thao', duration: '120 phút' },
];
