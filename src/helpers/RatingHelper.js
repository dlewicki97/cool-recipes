export function setStarsAttributes(starType, index, isSelected, selectedStar){
	for(let i=0 ; i<5 ;i++){
		if(i == index){
			starType[i].size = 80;
			starType[i].name = 'mdi-star';

		}else{
			starType[i].size = 50;
			starType[i].name = 'mdi-star-outline';
		}
		if(i <= index){
			starType[i].name = 'mdi-star';
		}else{
			starType[i].name = 'mdi-star-outline';
		}
		if(isSelected){
			starType[i].name = 'mdi-star-outline';
			starType[i].size = 50;
			selectedStar = null;
		}

	}
	return{
		starType,
		selectedStar
	}

}

export function selectStar(data){
	if(data.selectedStar == null){
		data.selectedStar = data.index+1;
	}else if(data.selectedStar != data.index+1 ){
		data.selectedStar = data.index+1;
	}else{
		if(data.selectedStar == data.index+1){
			data.isSelected = true;
		}
	}

	return {
		selectedStar: data.selectedStar,
		isSelected: data.isSelected
	};
}

export function getAverage(ratings){
	if(ratings.length == 0){
		return 0;
	}
	let result = 0;
	for(let i =0 ;i<ratings.length ; i++){
		result += ratings[i];
	}
	return Math.floor(result/ratings.length);
}