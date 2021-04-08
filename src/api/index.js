import {get,post,put,Delete} from './http';

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login`, params)
//添加歌手
export const insertSinger = (params) =>post(`singer/insert`,params)
//查询歌手
export const selectAllSinger = ()=>post('singer/selectAll')
//修改歌手
export const editSinger=(params)=>put('singer/update',params)
//删除歌手
export const deleteSinger=(params)=>Delete(`singer/delete`,params)


//查询某个歌手的所有歌曲
export const selectAllSongBySingerId=(params) =>get(`song/selectAllBySingerId?Song_singerId=${params}`)
//添加歌曲
export const insertSong=(params)=>post(`song/insert`,params)
//修改歌曲信息
export const updateSong=(params)=>post('song/update',params)
//删除歌曲
export const deleteSong=(params)=>post(`song/delete`,params)


//增加歌单
export const insertSongList=(params)=>post(`songlist/insert`,params)
//查询全部歌单
export const selectAllSongList=(prams)=>get(`songlist/selectAll`)
//修改歌单信息
export const updateSongList=(params)=>post(`songlist/update`,params)
//删除歌单
export const deleteSongList=(params)=>post(`songlist/delete`,params)

