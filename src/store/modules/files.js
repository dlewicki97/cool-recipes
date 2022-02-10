import Vue from 'vue'
import {fb, db} from '@/main'

const actions = {
	addPhoto({commit}, file){
		const storageRef = fb.storage().ref('avatars/'+localStorage.getItem('userId')+'/'+ file.name);
		storageRef.put(file);
	}
};

export default {
	actions
};