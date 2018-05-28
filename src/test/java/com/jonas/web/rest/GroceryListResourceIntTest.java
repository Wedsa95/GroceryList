package com.jonas.web.rest;

import com.jonas.GroceryListApp;

import com.jonas.domain.GroceryList;
import com.jonas.repository.GroceryListRepository;
import com.jonas.repository.UserRepository;
import com.jonas.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.jonas.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the GroceryListResource REST controller.
 *
 * @see GroceryListResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GroceryListApp.class)
public class GroceryListResourceIntTest {

    private static final Integer DEFAULT_LIST_NAME = 1;
    private static final Integer UPDATED_LIST_NAME = 2;

    private static final String DEFAULT_ITEM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ITEM_NAME = "BBBBBBBBBB";

    @Autowired
    private GroceryListRepository groceryListRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGroceryListMockMvc;

    private GroceryList groceryList;
    

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GroceryListResource groceryListResource = new GroceryListResource(groceryListRepository,userRepository);
        this.restGroceryListMockMvc = MockMvcBuilders.standaloneSetup(groceryListResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroceryList createEntity(EntityManager em) {
        GroceryList groceryList = new GroceryList()
            .listName(DEFAULT_LIST_NAME)
            .itemName(DEFAULT_ITEM_NAME);
        return groceryList;
    }

    @Before
    public void initTest() {
        groceryList = createEntity(em);
    }

    @Test
    @Transactional
    public void createGroceryList() throws Exception {
        int databaseSizeBeforeCreate = groceryListRepository.findAll().size();

        // Create the GroceryList
        restGroceryListMockMvc.perform(post("/api/grocery-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(groceryList)))
            .andExpect(status().isCreated());

        // Validate the GroceryList in the database
        List<GroceryList> groceryListList = groceryListRepository.findAll();
        assertThat(groceryListList).hasSize(databaseSizeBeforeCreate + 1);
        GroceryList testGroceryList = groceryListList.get(groceryListList.size() - 1);
        assertThat(testGroceryList.getListName()).isEqualTo(DEFAULT_LIST_NAME);
        assertThat(testGroceryList.getItemName()).isEqualTo(DEFAULT_ITEM_NAME);
    }

    @Test
    @Transactional
    public void createGroceryListWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = groceryListRepository.findAll().size();

        // Create the GroceryList with an existing ID
        groceryList.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGroceryListMockMvc.perform(post("/api/grocery-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(groceryList)))
            .andExpect(status().isBadRequest());

        // Validate the GroceryList in the database
        List<GroceryList> groceryListList = groceryListRepository.findAll();
        assertThat(groceryListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllGroceryLists() throws Exception {
        // Initialize the database
        groceryListRepository.saveAndFlush(groceryList);

        // Get all the groceryListList
        restGroceryListMockMvc.perform(get("/api/grocery-lists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(groceryList.getId().intValue())))
            .andExpect(jsonPath("$.[*].listName").value(hasItem(DEFAULT_LIST_NAME)))
            .andExpect(jsonPath("$.[*].itemName").value(hasItem(DEFAULT_ITEM_NAME.toString())));
    }

    @Test
    @Transactional
    public void getGroceryList() throws Exception {
        // Initialize the database
        groceryListRepository.saveAndFlush(groceryList);

        // Get the groceryList
        restGroceryListMockMvc.perform(get("/api/grocery-lists/{id}", groceryList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(groceryList.getId().intValue()))
            .andExpect(jsonPath("$.listName").value(DEFAULT_LIST_NAME))
            .andExpect(jsonPath("$.itemName").value(DEFAULT_ITEM_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGroceryList() throws Exception {
        // Get the groceryList
        restGroceryListMockMvc.perform(get("/api/grocery-lists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGroceryList() throws Exception {
        // Initialize the database
        groceryListRepository.saveAndFlush(groceryList);
        int databaseSizeBeforeUpdate = groceryListRepository.findAll().size();

        // Update the groceryList
        GroceryList updatedGroceryList = groceryListRepository.findOne(groceryList.getId());
        // Disconnect from session so that the updates on updatedGroceryList are not directly saved in db
        em.detach(updatedGroceryList);
        updatedGroceryList
            .listName(UPDATED_LIST_NAME)
            .itemName(UPDATED_ITEM_NAME);

        restGroceryListMockMvc.perform(put("/api/grocery-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGroceryList)))
            .andExpect(status().isOk());

        // Validate the GroceryList in the database
        List<GroceryList> groceryListList = groceryListRepository.findAll();
        assertThat(groceryListList).hasSize(databaseSizeBeforeUpdate);
        GroceryList testGroceryList = groceryListList.get(groceryListList.size() - 1);
        assertThat(testGroceryList.getListName()).isEqualTo(UPDATED_LIST_NAME);
        assertThat(testGroceryList.getItemName()).isEqualTo(UPDATED_ITEM_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingGroceryList() throws Exception {
        int databaseSizeBeforeUpdate = groceryListRepository.findAll().size();

        // Create the GroceryList

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGroceryListMockMvc.perform(put("/api/grocery-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(groceryList)))
            .andExpect(status().isCreated());

        // Validate the GroceryList in the database
        List<GroceryList> groceryListList = groceryListRepository.findAll();
        assertThat(groceryListList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGroceryList() throws Exception {
        // Initialize the database
        groceryListRepository.saveAndFlush(groceryList);
        int databaseSizeBeforeDelete = groceryListRepository.findAll().size();

        // Get the groceryList
        restGroceryListMockMvc.perform(delete("/api/grocery-lists/{id}", groceryList.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<GroceryList> groceryListList = groceryListRepository.findAll();
        assertThat(groceryListList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GroceryList.class);
        GroceryList groceryList1 = new GroceryList();
        groceryList1.setId(1L);
        GroceryList groceryList2 = new GroceryList();
        groceryList2.setId(groceryList1.getId());
        assertThat(groceryList1).isEqualTo(groceryList2);
        groceryList2.setId(2L);
        assertThat(groceryList1).isNotEqualTo(groceryList2);
        groceryList1.setId(null);
        assertThat(groceryList1).isNotEqualTo(groceryList2);
    }
}
